import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, X, User, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { profileStorage } from '@/lib/profileStorage';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  userName?: string;
  onAvatarChange?: (url: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

const MAX_FILE_SIZE_MB = 2;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
};

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  userName,
  onAvatarChange,
  size = 'lg',
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Please select a valid image file (JPG, PNG, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
    }
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast({
        title: 'Invalid file',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsDialogOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset file input
    event.target.value = '';
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropAndUpload = async () => {
    if (!imageSrc || !croppedAreaPixels || !selectedFile) return;

    setIsUploading(true);
    try {
      // Crop the image
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Compress the image
      const compressedFile = await imageCompression(
        new File([croppedBlob], selectedFile.name, { type: 'image/jpeg' }),
        {
          maxSizeMB: MAX_FILE_SIZE_MB,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        }
      );

      // Upload to Supabase storage
      const publicUrl = await profileStorage.uploadAvatar(compressedFile, userId);

      // Update avatar URL in profile
      await profileStorage.updateAvatarUrl(userId, publicUrl);

      setAvatarUrl(publicUrl);
      onAvatarChange?.(publicUrl);

      toast({
        title: 'Success',
        description: 'Profile picture uploaded successfully',
      });

      setIsDialogOpen(false);
      setImageSrc(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsDeleting(true);
    try {
      // Delete from storage
      await profileStorage.deleteAvatar(userId);

      // Update profile to remove avatar URL
      await profileStorage.updateAvatarUrl(userId, null);

      setAvatarUrl(undefined);
      onAvatarChange?.(null);

      toast({
        title: 'Success',
        description: 'Profile picture removed',
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setImageSrc(null);
    setSelectedFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const getInitials = () => {
    if (!userName) return 'U';
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={avatarUrl} alt={userName || 'User'} />
          <AvatarFallback>
            <User className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        {/* Hover overlay with edit button */}
        <label
          htmlFor={`avatar-upload-${userId}`}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
        >
          <Pencil className="h-6 w-6 text-white" />
        </label>

        <input
          id={`avatar-upload-${userId}`}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="flex gap-2">
        <label
          htmlFor={`avatar-upload-${userId}`}
          className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-sm"
        >
          <Upload className="h-4 w-4" />
          {avatarUrl ? 'Change Photo' : 'Upload Photo'}
        </label>

        {avatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </>
            )}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or WebP. Max {MAX_FILE_SIZE_MB}MB.
      </p>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Your Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-96 bg-muted rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleCropAndUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

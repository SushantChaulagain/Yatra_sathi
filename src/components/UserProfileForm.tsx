import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";

interface UserProfile {
  id?: string;
  name: string;
  age: number;
  location: string;
  experience: string;
  completedTreks: number;
  bio: string;
  interests: string[];
  nextTrek: string;
  availability: string;
  languages: string[];
  userId?: string;
  rating?: number;
  avatar?: string;
  createdAt?: string;
}

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  initialData?: UserProfile;
  isEditing?: boolean;
}

const UserProfileForm = ({ onSubmit, initialData, isEditing = false }: UserProfileFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    age: 18,
    location: "",
    experience: "",
    completedTreks: 0,
    bio: "",
    interests: [],
    nextTrek: "",
    availability: "",
    languages: [],
    ...initialData
  });

  const [newInterest, setNewInterest] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const nepaliLocations = [
    "Kathmandu", "Pokhara", "Chitwan", "Lalitpur", "Bhaktapur", "Biratnagar", 
    "Birgunj", "Dharan", "Janakpur", "Butwal", "Hetauda", "Itahari"
  ];

  const trekInterests = [
    "Annapurna Circuit", "Everest Base Camp", "Langtang Valley", "Manaslu Circuit",
    "Gokyo Lakes", "Poon Hill", "Upper Mustang", "Kanchenjunga", "Photography",
    "Cultural Exploration", "Wildlife Watching", "Technical Climbing", "Solo Travel",
    "Group Leading", "High Altitude", "Short Treks", "Digital Detox", "Local Culture"
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = ["2024", "2025"];

  const languages = [
    "English", "Nepali", "Hindi", "Mandarin", "Spanish", "French", 
    "German", "Japanese", "Korean", "Italian"
  ];

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest("");
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addLanguage = (language: string) => {
    if (language && !formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
    }
    setNewLanguage("");
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.location || !formData.experience) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.interests.length === 0) {
      toast({
        title: "Add at least one interest",
        description: "Please add your trekking interests.",
        variant: "destructive",
      });
      return;
    }

    if (formData.languages.length === 0) {
      toast({
        title: "Add at least one language",
        description: "Please add languages you speak.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const profileData = {
        ...formData,
        userId: user?.id
      };

      onSubmit(profileData);
      
      toast({
        title: isEditing ? "Profile updated!" : "Profile created!",
        description: isEditing ? "Your profile has been updated successfully." : "Welcome to the community!",
      });
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Your Profile" : "Create Your Trekker Profile"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Update your information to improve your matches"
            : "Tell us about yourself to find compatible trekking partners"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="16"
                max="80"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {nepaliLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level *</Label>
              <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner (0-5 treks)</SelectItem>
                  <SelectItem value="Intermediate">Intermediate (6-15 treks)</SelectItem>
                  <SelectItem value="Advanced">Advanced (15+ treks)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="completedTreks">Completed Treks</Label>
              <Input
                id="completedTreks"
                type="number"
                min="0"
                value={formData.completedTreks}
                onChange={(e) => setFormData(prev => ({ ...prev, completedTreks: parseInt(e.target.value) || 0 }))}
                placeholder="Number of treks completed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextTrek">Next Planned Trek</Label>
              <Input
                id="nextTrek"
                value={formData.nextTrek}
                onChange={(e) => setFormData(prev => ({ ...prev, nextTrek: e.target.value }))}
                placeholder="e.g., Annapurna Base Camp"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability *</Label>
            <div className="flex gap-2">
              <Select 
                value={formData.availability.split(' ')[0]} 
                onValueChange={(month) => {
                  const year = formData.availability.split(' ')[1] || '2025';
                  setFormData(prev => ({ ...prev, availability: `${month} ${year}` }));
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={formData.availability.split(' ')[1]} 
                onValueChange={(year) => {
                  const month = formData.availability.split(' ')[0] || 'March';
                  setFormData(prev => ({ ...prev, availability: `${month} ${year}` }));
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself, your trekking experience, and what you're looking for in a trek partner..."
              rows={3}
            />
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Trekking Interests *</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newInterest} onValueChange={setNewInterest}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add an interest" />
                </SelectTrigger>
                <SelectContent>
                  {trekInterests.filter(interest => !formData.interests.includes(interest)).map(interest => (
                    <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => addInterest(newInterest)}
                disabled={!newInterest}
                className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 disabled:bg-gray-300 disabled:border-gray-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label>Languages *</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newLanguage} onValueChange={setNewLanguage}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.filter(language => !formData.languages.includes(language)).map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => addLanguage(newLanguage)}
                disabled={!newLanguage}
                className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 disabled:bg-gray-300 disabled:border-gray-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map(language => (
                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                  {language}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeLanguage(language)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {isEditing ? "Update Profile" : "Create Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm; 
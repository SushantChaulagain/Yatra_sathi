import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isOwn = message.sender_id === currentUserId;
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });

  return (
    <div className={cn(
      "flex mb-4 animate-in slide-in-from-bottom-2",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
        isOwn
          ? "bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] text-white"
          : "bg-muted"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p className={cn(
          "text-xs mt-1 flex items-center gap-1",
          isOwn ? "text-white/70 justify-end" : "text-muted-foreground"
        )}>
          <span>{timeAgo}</span>
          {isOwn && message.is_read && (
            <span className="text-xs">• Read</span>
          )}
        </p>
      </div>
    </div>
  );
}

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ConversationWithUser } from '@/lib/messaging';

interface ConversationItemProps {
  conversation: ConversationWithUser;
  isActive?: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const hasUnread = conversation.unreadCount > 0;
  const timeAgo = conversation.last_message_at
    ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
    : null;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b",
        isActive && "bg-muted",
        hasUnread && "bg-[hsl(var(--himalayan-sky))]/5"
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={conversation.otherUser.avatar}
          alt={conversation.otherUser.name}
        />
        <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] text-white">
          {conversation.otherUser.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={cn(
            "font-semibold truncate",
            hasUnread && "text-[hsl(var(--himalayan-deep-blue))]"
          )}>
            {conversation.otherUser.name}
          </h3>
          {timeAgo && (
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {timeAgo}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            "text-sm truncate",
            hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {conversation.last_message || 'Start a conversation'}
          </p>
          {hasUnread && (
            <Badge className="bg-[hsl(var(--himalayan-deep-blue))] text-white flex-shrink-0">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

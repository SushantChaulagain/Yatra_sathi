import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { messaging, type ConversationWithUser } from '@/lib/messaging';
import { useRealtimeMessages } from '@/lib/useRealtimeMessages';
import { MessageBubble } from '@/components/messaging/MessageBubble';
import { MessageInput } from '@/components/messaging/MessageInput';
import { useToast } from '@/hooks/use-toast';

export default function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [conversation, setConversation] = useState<ConversationWithUser | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { messages, loading } = useRealtimeMessages(conversationId || null);

  useEffect(() => {
    checkAuthAndLoadConversation();
  }, [conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const checkAuthAndLoadConversation = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Store current user ID immediately
      setCurrentUserId(session.user.id);

      if (!conversationId) {
        navigate('/messages');
        return;
      }

      const conv = await messaging.getConversation(conversationId);
      if (!conv) {
        toast({
          title: 'Error',
          description: 'Conversation not found',
          variant: 'destructive'
        });
        navigate('/messages');
        return;
      }

      setConversation(conv);
    } catch (error) {
      console.error('Error loading conversation:', error);
      navigate('/messages');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;

    try {
      await messaging.sendMessage(conversationId, content);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  if (loading || !conversation || !currentUserId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-white p-4 flex items-center gap-4 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/messages')}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage
            src={conversation.otherUser.avatar
              ? `https://images.unsplash.com/${conversation.otherUser.avatar}?w=100&h=100&fit=crop&crop=face`
              : undefined
            }
            alt={conversation.otherUser.name}
          />
          <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] text-white">
            {conversation.otherUser.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{conversation.otherUser.name}</h2>
          <p className="text-sm text-muted-foreground">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={conversation.otherUser.avatar
                      ? `https://images.unsplash.com/${conversation.otherUser.avatar}?w=100&h=100&fit=crop&crop=face`
                      : undefined
                    }
                    alt={conversation.otherUser.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] text-white">
                    {conversation.otherUser.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Start chatting with {conversation.otherUser.name}
              </h3>
              <p className="text-muted-foreground">
                Plan your trek together and discuss the details!
              </p>
            </div>
          ) : (
            <>
              {currentUserId && messages.map((message) => (
                <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
              ))}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

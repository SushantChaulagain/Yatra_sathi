import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type Conversation = Database['public']['Tables']['conversations']['Row'];

export interface ConversationWithUser extends Conversation {
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
  unreadCount: number;
}

export const messaging = {
  /**
   * Get or create a conversation with another user
   */
  async getOrCreateConversation(otherUserId: string): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        other_user_id: otherUserId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  },

  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<ConversationWithUser[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get all conversations
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (convError) throw convError;
      if (!conversations) return [];

      // Get other user IDs
      const otherUserIds = conversations.map(conv =>
        conv.user1_id === user.id ? conv.user2_id : conv.user1_id
      );

      // Get profiles for other users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', otherUserIds);

      if (profileError) throw profileError;

      // Get unread counts for each conversation
      const unreadCounts = await Promise.all(
        conversations.map(async (conv) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .eq('is_read', false);
          return { conversationId: conv.id, count: count || 0 };
        })
      );

      // Combine data
      return conversations.map(conv => {
        const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
        const profile = profiles?.find(p => p.user_id === otherUserId);
        const unread = unreadCounts.find(u => u.conversationId === conv.id);

        return {
          ...conv,
          otherUser: {
            id: otherUserId,
            name: profile?.full_name || 'Unknown User',
            avatar: profile?.avatar_url || null
          },
          unreadCount: unread?.count || 0
        };
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  },

  /**
   * Get conversation by ID with other user info
   */
  async getConversation(conversationId: string): Promise<ConversationWithUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;
      if (!conv) return null;

      // Get other user
      const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .eq('user_id', otherUserId)
        .single();

      // Get unread count
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      return {
        ...conv,
        otherUser: {
          id: otherUserId,
          name: profile?.full_name || 'Unknown User',
          avatar: profile?.avatar_url || null
        },
        unreadCount: count || 0
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, limit = 100): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  /**
   * Send a message
   */
  async sendMessage(conversationId: string, content: string): Promise<Message | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const messageData: MessageInsert = {
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim()
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  },

  /**
   * Mark messages as read in a conversation
   */
  async markAsRead(conversationId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) console.error('Error marking messages as read:', error);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  },

  /**
   * Get total unread message count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      // Get all conversations
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (!conversations || conversations.length === 0) return 0;

      const conversationIds = conversations.map(c => c.id);

      // Count unread messages in all conversations
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  /**
   * Subscribe to new messages in a conversation
   */
  subscribeToMessages(
    conversationId: string,
    onNewMessage: (message: Message) => void
  ) {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          onNewMessage(payload.new as Message);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Message updated (read status):', payload);
          // Trigger a refresh when messages are marked as read
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe((status) => {
        console.log(`Message subscription status for ${conversationId}:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to conversation updates (new messages, read status, etc.)
   */
  subscribeToConversations(onUpdate: () => void) {
    const channel = supabase
      .channel('all-conversations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation update:', payload);
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Message update:', payload);
          onUpdate();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

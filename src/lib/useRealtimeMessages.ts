import { useEffect, useState } from 'react';
import { messaging } from './messaging';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];

/**
 * Custom hook for real-time messages in a conversation
 * Automatically loads messages and subscribes to new ones
 */
export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const msgs = await messaging.getMessages(conversationId);
        setMessages(msgs);

        // Mark messages as read
        await messaging.markAsRead(conversationId);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load initial messages
    loadMessages();

    // Subscribe to new messages and updates
    unsubscribe = messaging.subscribeToMessages(conversationId, (newMessage) => {
      setMessages((prev) => {
        // Check if message already exists (update case)
        const existingIndex = prev.findIndex(m => m.id === newMessage.id);
        if (existingIndex !== -1) {
          // Update existing message
          const updated = [...prev];
          updated[existingIndex] = newMessage;
          return updated;
        }
        // Add new message
        return [...prev, newMessage];
      });

      // Auto-mark as read when new message arrives
      messaging.markAsRead(conversationId);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [conversationId]);

  return { messages, loading };
}

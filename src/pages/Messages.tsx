import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, Inbox } from 'lucide-react';
import { messaging, type ConversationWithUser } from '@/lib/messaging';
import { ConversationItem } from '@/components/messaging/ConversationItem';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const checkAuthAndLoadConversations = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          navigate('/auth');
          return;
        }

        await loadConversations();

        // Subscribe to conversation updates
        unsubscribe = messaging.subscribeToConversations(() => {
          loadConversations();
        });
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadConversations();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadConversations = async () => {
    const convs = await messaging.getConversations();
    setConversations(convs);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[hsl(var(--muted))]">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border-2 border-white/20">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Messages
              </h1>
              <p className="text-lg text-white/90">
                Connect with your trek partners in real-time
              </p>
            </div>
          </div>
        </section>

        {/* Conversations List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Inbox className="h-5 w-5" />
                    Your Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {conversations.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No messages yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start chatting with trekkers you've matched with!
                      </p>
                      <button
                        onClick={() => navigate('/find-friend')}
                        className="text-[hsl(var(--himalayan-deep-blue))] hover:underline font-semibold"
                      >
                        Find Trek Partners →
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {conversations.map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          onClick={() => navigate(`/chat/${conv.id}`)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

-- ============================================
-- MESSAGING FEATURE FOR COLLEGE DEMO
-- Real-time chat between matched trekkers
-- ============================================

-- Table 1: Conversations (Chat threads between two users)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- Ensure unique pairs and different users
  CONSTRAINT unique_conversation_pair CHECK (user1_id < user2_id),
  CONSTRAINT different_conversation_users CHECK (user1_id != user2_id),
  CONSTRAINT unique_user_pair UNIQUE(user1_id, user2_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON public.conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON public.conversations(user2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC NULLS LAST);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;

-- RLS Policy: Users can view conversations they're part of
CREATE POLICY "Users can view their own conversations"
ON public.conversations
FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policy: Users can create conversations
CREATE POLICY "Users can create conversations"
ON public.conversations
FOR INSERT
WITH CHECK (
  auth.uid() = user1_id OR auth.uid() = user2_id
);

-- RLS Policy: Users can update their conversations
CREATE POLICY "Users can update their conversations"
ON public.conversations
FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- Table 2: Messages (Individual chat messages)
-- ============================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 5000 AND char_length(trim(content)) > 0),
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(is_read) WHERE is_read = false;

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update message read status" ON public.messages;

-- RLS Policy: Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);

-- RLS Policy: Users can send messages to their conversations
CREATE POLICY "Users can send messages to their conversations"
ON public.messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);

-- RLS Policy: Users can mark their received messages as read
CREATE POLICY "Users can update message read status"
ON public.messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    AND sender_id != auth.uid()
  )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- Function: Update conversation last message
-- ============================================

CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE conversations
  SET
    last_message = left(NEW.content, 100),
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON public.messages;
CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();


-- ============================================
-- Function: Get or create conversation
-- ============================================

CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  other_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  conversation_id UUID;
  user_1 UUID;
  user_2 UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF current_user_id = other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;

  -- Order users consistently (smaller UUID first)
  IF current_user_id < other_user_id THEN
    user_1 := current_user_id;
    user_2 := other_user_id;
  ELSE
    user_1 := other_user_id;
    user_2 := current_user_id;
  END IF;

  -- Try to find existing conversation
  SELECT id INTO conversation_id
  FROM conversations
  WHERE user1_id = user_1 AND user2_id = user_2;

  -- Create if doesn't exist
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (user1_id, user2_id)
    VALUES (user_1, user_2)
    RETURNING id INTO conversation_id;
  END IF;

  RETURN conversation_id;
END;
$$;


-- ============================================
-- Enable Realtime for live updates
-- ============================================

-- Enable Realtime on conversations table (ignore if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Table already in publication, ignore
END $$;

-- Enable Realtime on messages table (ignore if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE messages;
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Table already in publication, ignore
END $$;


-- ============================================
-- SUCCESS! Messaging tables created
-- ============================================
-- Next: Run this SQL in Supabase dashboard
-- Then: Reload schema cache
-- Features:
-- ✅ Real-time message updates
-- ✅ Real-time conversation updates
-- ✅ Unread message tracking
-- ✅ Row Level Security enabled
-- ============================================

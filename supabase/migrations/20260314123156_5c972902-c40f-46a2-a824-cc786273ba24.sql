
-- Campus posts table for news/info sharing with categories
CREATE TABLE public.campus_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  college_name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campus_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campus posts viewable by everyone" ON public.campus_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.campus_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.campus_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.campus_posts FOR DELETE USING (auth.uid() = user_id);

-- Campus groups table
CREATE TABLE public.campus_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  group_type text NOT NULL DEFAULT 'general',
  year text,
  branch text,
  college_name text NOT NULL,
  created_by uuid NOT NULL,
  member_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campus_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Groups viewable by everyone" ON public.campus_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create groups" ON public.campus_groups FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Group members table
CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.campus_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members viewable by everyone" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE USING (auth.uid() = user_id);

-- Group messages table
CREATE TABLE public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.campus_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group messages viewable by everyone" ON public.group_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.group_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime for group messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campus_posts;

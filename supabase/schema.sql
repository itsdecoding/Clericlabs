-- =========================================================
-- Content OS / RewriteMinds Pipeline: Supabase Schema for content_cards
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- URL: https://supabase.com/dashboard/project/viehbqgtrdlxujfbrfms/sql/new
-- =========================================================

-- 1. Create content_cards table
CREATE TABLE IF NOT EXISTS content_cards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'IG Carousel',
  category TEXT,
  topic TEXT,
  topic_color TEXT,
  status TEXT NOT NULL DEFAULT 'Idea',
  priority TEXT DEFAULT 'Medium',
  assignee TEXT,
  slides_count INTEGER,
  slide_copy TEXT,
  caption TEXT,
  hashtags TEXT,
  due_date TEXT,
  posted_at TEXT,
  tags TEXT,
  brief_url TEXT,
  final_files_url TEXT,
  cover_image_url TEXT,
  supporting_assets_url TEXT,
  posted_url TEXT,
  owner TEXT DEFAULT 'Unassigned',
  pm TEXT DEFAULT 'Unassigned',
  project_manager TEXT DEFAULT 'Unassigned',
  designer TEXT DEFAULT 'Unassigned',
  writer TEXT DEFAULT 'Unassigned',
  activity_log JSONB DEFAULT '[]'::jsonb,
  activities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for fast filtering and Kanban queries
CREATE INDEX IF NOT EXISTS idx_content_cards_status ON content_cards(status);
CREATE INDEX IF NOT EXISTS idx_content_cards_type ON content_cards(type);
CREATE INDEX IF NOT EXISTS idx_content_cards_created_at ON content_cards(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE content_cards ENABLE ROW LEVEL SECURITY;

-- 4. Create public policies (for anon and authenticated users)
DROP POLICY IF EXISTS "Allow public select on content_cards" ON content_cards;
CREATE POLICY "Allow public select on content_cards"
  ON content_cards FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert on content_cards" ON content_cards;
CREATE POLICY "Allow public insert on content_cards"
  ON content_cards FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on content_cards" ON content_cards;
CREATE POLICY "Allow public update on content_cards"
  ON content_cards FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow public delete on content_cards" ON content_cards;
CREATE POLICY "Allow public delete on content_cards"
  ON content_cards FOR DELETE
  USING (true);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_content_cards_updated_at ON content_cards;
CREATE TRIGGER update_content_cards_updated_at
  BEFORE UPDATE ON content_cards
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

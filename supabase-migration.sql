-- Orima Music App - Supabase Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- IMPORTANT: Disable email confirmation in Supabase Dashboard:
-- Authentication > Settings > Enable email confirmations = OFF

-- 1. Profiles table (auto-created via trigger on signup)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Liked Songs table
CREATE TABLE IF NOT EXISTS liked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  title TEXT,
  artist TEXT,
  album TEXT,
  thumb TEXT,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- 3. Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Playlist Songs table
CREATE TABLE IF NOT EXISTS playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  title TEXT,
  artist TEXT,
  album TEXT,
  thumb TEXT,
  duration TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Profiles: public read (for username lookup), owner can update
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Liked Songs: users can fully manage their own liked songs
CREATE POLICY "Users view own liked songs" ON liked_songs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own liked songs" ON liked_songs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own liked songs" ON liked_songs FOR DELETE USING (auth.uid() = user_id);

-- Playlists: users can fully manage their own playlists
CREATE POLICY "Users view own playlists" ON playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own playlists" ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own playlists" ON playlists FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users update own playlists" ON playlists FOR UPDATE USING (auth.uid() = user_id);

-- Playlist Songs: users can manage songs in their own playlists
CREATE POLICY "Users view own playlist songs" ON playlist_songs FOR SELECT
  USING (playlist_id IN (SELECT id FROM playlists WHERE user_id = auth.uid()));
CREATE POLICY "Users insert own playlist songs" ON playlist_songs FOR INSERT
  WITH CHECK (playlist_id IN (SELECT id FROM playlists WHERE user_id = auth.uid()));
CREATE POLICY "Users delete own playlist songs" ON playlist_songs FOR DELETE
  USING (playlist_id IN (SELECT id FROM playlists WHERE user_id = auth.uid()));

-- 7. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 8. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_liked_songs_user ON liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_track ON liked_songs(track_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist ON playlist_songs(playlist_id);

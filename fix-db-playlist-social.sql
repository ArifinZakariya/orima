-- Add cover_url to playlists
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Add playlist support to social_messages
ALTER TABLE social_messages ADD COLUMN IF NOT EXISTS playlist_id UUID;
ALTER TABLE social_messages ADD COLUMN IF NOT EXISTS msg_type TEXT DEFAULT 'song';

-- Add index for playlist shares
CREATE INDEX IF NOT EXISTS idx_social_messages_playlist ON social_messages(playlist_id);

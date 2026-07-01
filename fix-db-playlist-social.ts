import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.rymjroodmcfmaobsagqn',
  password: 'orimamusic123!',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  // Add cover_url to playlists
  await client.query(`ALTER TABLE playlists ADD COLUMN IF NOT EXISTS cover_url TEXT;`);
  console.log('playlists.cover_url added');

  // Add playlist_id to social_messages
  await client.query(`ALTER TABLE social_messages ADD COLUMN IF NOT EXISTS playlist_id UUID;`);
  console.log('social_messages.playlist_id added');

  // Add msg_type to social_messages
  await client.query(`ALTER TABLE social_messages ADD COLUMN IF NOT EXISTS msg_type TEXT DEFAULT 'song';`);
  console.log('social_messages.msg_type added');

  // Add index
  await client.query(`CREATE INDEX IF NOT EXISTS idx_social_messages_playlist ON social_messages(playlist_id);`);
  console.log('index added');

  await client.end();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });

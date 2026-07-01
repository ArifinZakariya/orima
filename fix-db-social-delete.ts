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

  // Enable RLS if not already
  await client.query(`ALTER TABLE social_messages ENABLE ROW LEVEL SECURITY;`);
  console.log('RLS enabled');

  // Add delete policy for own messages
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users delete own social messages' AND tablename = 'social_messages'
      ) THEN
        CREATE POLICY "Users delete own social messages" ON social_messages
          FOR DELETE USING (auth.uid() = user_id);
      END IF;
    END $$;
  `);
  console.log('Delete policy added');

  await client.end();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });

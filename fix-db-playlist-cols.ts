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

  await client.query(`ALTER TABLE social_messages ADD COLUMN IF NOT EXISTS playlist_name TEXT;`);
  console.log('playlist_name added');

  await client.query(`ALTER TABLE social_messages ADD COLUMN IF NOT EXISTS playlist_cover TEXT;`);
  console.log('playlist_cover added');

  await client.query(`ALTER TABLE social_messages ADD COLUMN IF NOT EXISTS playlist_count TEXT DEFAULT '0';`);
  console.log('playlist_count added');

  await client.end();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });

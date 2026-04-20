require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log('Missing env vars:', { url, key: !!key });
  process.exit(1);
}

const sb = createClient(url, key);

async function test() {
  const { data, error } = await sb.from('ordenes_monzza').select('id').limit(1);
  if (error) {
    console.error('Supabase ERROR:', error);
  } else {
    console.log('Supabase Data:', data);
  }
}
test();

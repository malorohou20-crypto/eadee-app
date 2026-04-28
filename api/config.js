export const config = { runtime: 'edge' };

export default function handler(req) {
  return new Response(JSON.stringify({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

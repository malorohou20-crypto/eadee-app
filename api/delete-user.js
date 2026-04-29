export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { userId, accessToken } = await req.json();

    if (!userId || !accessToken) {
      return new Response('Missing userId or accessToken', { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
      return new Response('Service key not configured', { status: 500 });
    }

    // Vérifier que le token appartient bien à cet userId (sécurité)
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': serviceKey,
      },
    });
    const userData = await userRes.json();
    if (!userRes.ok || userData.id !== userId) {
      return new Response('Unauthorized', { status: 403 });
    }

    // Supprimer les données (les FK cascade suppriment plans, chats, achats)
    await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    });

    // Supprimer l'auth user via Admin API
    const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    });

    if (!deleteRes.ok) {
      const err = await deleteRes.text();
      console.error('delete-user error:', err);
      return new Response('Error deleting auth user', { status: 500 });
    }

    console.log(`✅ Compte supprimé : ${userId}`);
    return new Response('OK', { status: 200 });

  } catch (e) {
    console.error('delete-user.js error:', e);
    return new Response('Internal error', { status: 500 });
  }
}

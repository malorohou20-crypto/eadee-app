export const config = { runtime: 'edge' };

const PLANS = {
  starter: { name: 'Pack Starter — 1 crédit', amount: 299, credits: 1 },
  builder: { name: 'Pack Builder — 3 crédits', amount: 799, credits: 3 },
  empire:  { name: 'Pack Empire — 8 crédits',  amount: 1999, credits: 8 },
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const origin = req.headers.get('origin') || 'https://eadee-app.vercel.app';

  try {
    const { plan, userId, userEmail } = await req.json();
    const p = PLANS[plan?.toLowerCase()];
    if (!p) return new Response('Plan invalide', { status: 400 });

    const params = new URLSearchParams({
      'payment_method_types[]': 'card',
      'mode': 'payment',
      'success_url': `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${origin}/?payment=cancel`,
      'line_items[0][price_data][currency]': 'eur',
      'line_items[0][price_data][product_data][name]': p.name,
      'line_items[0][price_data][unit_amount]': String(p.amount),
      'line_items[0][quantity]': '1',
      'metadata[userId]': userId || '',
      'metadata[plan]': plan.toLowerCase(),
      'metadata[credits]': String(p.credits),
    });
    if (userEmail) params.set('customer_email', userEmail);

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await res.json();
    if (!res.ok) throw new Error(session.error?.message || 'Stripe error');

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('stripe-checkout error:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

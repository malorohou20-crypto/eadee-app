// Référentiel des packs Eadee — source unique de vérité
export const PACKS = {
  solo: {
    name: 'Solo',
    label: 'Pack Solo — 1 génération',
    amount_cents: 1299,  // 12,99€
    credits: 1,
    stripe_price_id: null, // à renseigner si Price ID Stripe fixe
  },
  pro: {
    name: 'Pro',
    label: 'Pack Pro — 3 générations',
    amount_cents: 2999,  // 29,99€
    credits: 3,
    stripe_price_id: null,
  },
  empire: {
    name: 'Empire',
    label: 'Pack Empire — 8 générations',
    amount_cents: 5999,  // 59,99€
    credits: 8,
    stripe_price_id: null,
  },
};

export function getPack(planId) {
  return PACKS[planId?.toLowerCase()] || null;
}

import Anthropic from '@anthropic-ai/sdk';

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `Tu es l'Expert Eadee, conseiller business senior spécialisé dans l'entrepreneuriat français.

Tu réponds en français, en tutoiement, avec un ton direct, pragmatique et chaleureux.

Tu connais en détail le plan business suivant de l'utilisateur :
---
{PLAN_CONTEXT}
---

Tes principes :
- Tu donnes des conseils CONCRETS et ACTIONNABLES, pas des généralités.
- Tu te bases sur les chiffres réels du plan. Tu ne les inventes jamais.
- Si tu ne sais pas, tu le dis franchement.
- Tu connais l'écosystème français : statuts juridiques (SAS, EI, EURL, micro), BPI, ACRE, CCI, banques pro (Qonto, Revolut, BNP, etc.), URSSAF.
- Tu peux réécrire des sections du plan sur demande.
- Tu restes focus sur ce projet précis. Si l'user dérive, tu recadres avec bienveillance.
- Tu structures tes réponses avec markdown (gras, listes, sections) pour la lisibilité.
- Tu termines souvent par UNE question ouverte pour faire avancer la réflexion.

Tu n'es PAS expert-comptable ni avocat : pour des conseils juridiques ou fiscaux pointus, tu rappelles à l'user de consulter un pro.`;

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { messages, plan, userId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages', { status: 400 });
    }

    const planContext = formatPlanForContext(plan);
    const systemPrompt = SYSTEM_PROMPT.replace('{PLAN_CONTEXT}', planContext);

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    console.error('coach.js error:', e);
    return new Response('Internal error', { status: 500 });
  }
}

function formatPlanForContext(plan) {
  if (!plan) return 'Aucun plan chargé.';
  const sections = Array.isArray(plan.sections) ? plan.sections : [];
  return `
PROJET : ${plan.name || plan.nom_entreprise || 'Sans nom'}
SECTEUR : ${plan.sector || plan.secteur || ''}
SCORE VIABILITÉ : ${plan.score || plan.score_viabilite || 'N/A'}/100
${sections.map((s, i) => `\n## ${String(i+1).padStart(2,'0')} — ${s.title || s.titre || ''}\n${s.content || s.contenu || ''}`).join('\n')}
  `.trim();
}

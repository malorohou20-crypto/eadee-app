export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, businessContext } = req.body;

  const systemPrompt = `Tu es EADEE Coach, un conseiller business d'élite réservé aux membres Empire. Tu es expert dans TOUS les secteurs d'activité.

${businessContext ? `Contexte du client : ${businessContext}` : ''}

Ton rôle :
- Conseiller stratégique personnalisé
- Analyser les problèmes business et proposer des solutions concrètes
- Aider à prendre des décisions importantes
- Donner des conseils marketing, financiers, opérationnels
- Motiver et coacher l'entrepreneur

Style : Direct, professionnel, bienveillant. Réponds toujours avec des actions concrètes.
Langue : Français uniquement.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Erreur du chat' });
  }
}

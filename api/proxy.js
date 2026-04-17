export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const text = (data.content || []).map(i => i.text || '').join('');

    // Find the JSON block
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return res.status(500).json({ error: { message: 'Pas de JSON dans la réponse' } });
    }

    let raw = text.slice(start, end + 1);

    // Nuclear clean: replace ALL literal control chars with space
    // Safe because JSON ignores whitespace between tokens,
    // and spaces inside strings are acceptable for display
    raw = raw.replace(/[\n\r\t]/g, ' ');

    let plan;
    try {
      plan = JSON.parse(raw);
    } catch(e) {
      return res.status(500).json({ error: { message: 'JSON invalide même après nettoyage: ' + e.message } });
    }

    // Return a clean response with valid JSON text
    return res.status(200).json({
      ...data,
      content: [{ type: 'text', text: JSON.stringify(plan) }]
    });

  } catch (err) {
    return res.status(500).json({ error: { message: 'Erreur serveur: ' + err.message } });
  }
}

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

    // Extract text from response
    const text = (data.content || []).map(i => i.text || '').join('');

    // Find JSON block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(200).json({ ...data, _cleaned: false });
    }

    // Clean the JSON server-side (more reliable in Node.js)
    let raw = jsonMatch[0];

    // Remove control characters inside string values
    let cleaned = '';
    let inString = false;
    let escape = false;
    for (let i = 0; i < raw.length; i++) {
      const c = raw[i];
      if (escape) {
        cleaned += c;
        escape = false;
        continue;
      }
      if (c === '\\') { escape = true; cleaned += c; continue; }
      if (c === '"') { inString = !inString; cleaned += c; continue; }
      if (inString) {
        if (c === '\n') { cleaned += '\\n'; continue; }
        if (c === '\r') { cleaned += '\\r'; continue; }
        if (c === '\t') { cleaned += '\\t'; continue; }
      }
      cleaned += c;
    }

    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch(e) {
      // Try truncating at last valid }
      const last = cleaned.lastIndexOf('}');
      try {
        plan = JSON.parse(cleaned.substring(0, last + 1));
      } catch(e2) {
        return res.status(200).json({ ...data, _cleaned: false });
      }
    }

    // Return original data with cleaned plan embedded
    return res.status(200).json({
      ...data,
      content: [{ type: 'text', text: JSON.stringify(plan) }],
      _cleaned: true
    });

  } catch (err) {
    return res.status(500).json({ error: { message: 'Erreur serveur: ' + err.message } });
  }
}

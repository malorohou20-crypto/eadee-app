export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, businessPlan, userName } = req.body;
  const prenom = userName || 'vous';

  const planContext = businessPlan ? `
BUSINESS PLAN ACTUEL DU CLIENT:
- Nom du business: ${businessPlan.nom_business || 'Non défini'}
- Tagline: ${businessPlan.tagline || ''}
- Secteur: ${businessPlan.secteur || ''}
- Résumé: ${businessPlan.resume_executif || ''}
- Modèle économique: ${businessPlan.modele_economique || ''}
- Offres: ${JSON.stringify(businessPlan.offres || [])}
- Score viabilité: ${businessPlan.score_viabilite || ''}
- CA An 1 estimé: ${businessPlan.rev_m12 || ''}
- Plan JSON complet disponible pour modification.
` : '';

  const systemPrompt = `Tu es l'ASSOCIÉ IA d'EADEE, le partenaire business de ${prenom}. Tu n'es pas un simple chatbot — tu es son vrai associé stratégique, disponible 24h/24, expert en création et développement d'entreprise en France.

${planContext}

TON RÔLE D'ASSOCIÉ :
Tu peux TOUT faire pour aider ${prenom} à développer son business :

1. MODIFIER LE BUSINESS PLAN EN DIRECT
   Quand ${prenom} te demande de changer quelque chose (nom, prix, description, email, démarche...), fais-le immédiatement.
   Pour chaque modification, utilise ce format EXACT à la fin de ta réponse :
   [MODIF:champ=valeur]

   Exemples :
   [MODIF:nom_business=VélôBretagne]
   [MODIF:tagline=Le vélo de qualité au coeur de la Bretagne]
   [MODIF:email_prospection_sujet=Votre nouveau partenaire vélo à Penmarc'h]

2. CORRIGER LES DOCUMENTS
   Si un email, une démarche ou un document a une erreur, corrige-le directement avec [MODIF:...]

3. CONSEILS STRATÉGIQUES
   Analyse, conseille, propose des solutions concrètes avec des chiffres.

4. RÉPONDRE À TOUTES LES QUESTIONS
   Juridique, fiscal, marketing, RH, financement, pricing, concurrence...

STYLE : Tu parles comme un associé proche, direct, expert. Tu tutoies ${prenom}. Tu vas droit au but.
LANGUE : Français uniquement.
IMPORTANT : Sois proactif — si tu vois une amélioration possible dans le plan, propose-la.`;

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
        max_tokens: 1500,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    const replyText = data.content[0].text;

    // Extract modifications tags [MODIF:field=value]
    const modifications = {};
    const modifRegex = /\[MODIF:([^=\]]+)=([^\]]+)\]/g;
    let match;
    while ((match = modifRegex.exec(replyText)) !== null) {
      modifications[match[1].trim()] = match[2].trim();
    }

    // Clean reply (remove modif tags from visible text)
    const cleanReply = replyText.replace(/\[MODIF:[^\]]+\]/g, '').trim();

    res.status(200).json({ reply: cleanReply, modifications });
  } catch (err) {
    res.status(500).json({ error: 'Erreur du chat: ' + err.message });
  }
}

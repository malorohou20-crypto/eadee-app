export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { secteur, description, budget, objectif } = req.body;

  const prompt = `Tu es EADEE, le meilleur conseiller en business au monde. Tu dois générer un business plan COMPLET, PROFESSIONNEL et DÉTAILLÉ pour un entrepreneur.

INFORMATIONS CLIENT :
- Secteur d'activité : ${secteur}
- Description du projet : ${description}
- Budget disponible : ${budget}
- Objectif principal : ${objectif}

Génère un business plan structuré avec exactement ces sections :

# 1. RÉSUMÉ EXÉCUTIF
Synthèse du projet, vision, mission et proposition de valeur unique.

# 2. ANALYSE DU MARCHÉ
- Taille et tendances du marché
- Public cible détaillé (personas)
- Analyse concurrentielle (3-5 concurrents)
- Opportunités et menaces

# 3. OFFRE ET PRODUITS/SERVICES
Description détaillée, avantages concurrentiels, tarification recommandée.

# 4. STRATÉGIE COMMERCIALE
- Canaux d'acquisition clients
- Plan marketing (réseaux sociaux, SEO, publicité)
- Stratégie de vente et fidélisation

# 5. PLAN OPÉRATIONNEL
Organisation, ressources humaines, processus clés, outils recommandés.

# 6. PROJECTIONS FINANCIÈRES
- Investissement initial détaillé
- Prévisions CA : Mois 1-3, Mois 4-6, An 1, An 2, An 3
- Point mort (break-even)
- Rentabilité estimée

# 7. GESTION DES RISQUES
Top 5 risques et plans de mitigation concrets.

# 8. PLAN D'ACTION 90 JOURS
Semaine par semaine : actions prioritaires pour démarrer.

# 9. CONCLUSION ET RECOMMANDATIONS EADEE
Conseils personnalisés et prochaines étapes clés.

Sois précis, concret, avec des chiffres réalistes. Qualité professionnelle de consultant senior.`;

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
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    res.status(200).json({ plan: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la génération' });
  }
}

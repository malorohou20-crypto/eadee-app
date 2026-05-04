export const config = { runtime: 'nodejs' };

// =====================================================================
// EADEE — Pipeline génération business plan (3 étapes)
// Étape 1 : Données INSEE (APIs gratuites)
// Étape 2 : Recherche web via Claude web_search (données marché vérifiées)
// Étape 3 : Génération plan complet avec données consolidées
// Runtime : Node.js (pas Edge — nécessite SDK + jsonrepair)
// =====================================================================

import { jsonrepair } from 'jsonrepair';
import { fetchINSEEData } from './lib/insee.js';
import { getKnowledgeContext } from './lib/knowledge.js';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────

function buildSystemPrompt(verifiedData, knowledgeBase) {
  return `Tu es un expert business plan senior français qui produit des dossiers conformes aux attentes des banques, BPI, et CCI.

RÈGLES STRICTES SUR LES CHIFFRES :
1. Chaque chiffre marché DOIT être sourcé avec la source réelle citée entre crochets [Source : ...].
2. Si tu n'as pas de source vérifiée, écris explicitement : "[Estimation IA — à confronter aux données officielles]".
3. Ne JAMAIS inventer un chiffre exact sans source. Préfère une fourchette ("entre 1,5 et 2,2 Mds€") à un chiffre faussement précis.
4. Les projections financières doivent lister les hypothèses utilisées en début de section.
5. Pour chaque chiffre, ajoute un marqueur de fiabilité : [VERIFIE], [ESTIMATION] ou [HYPOTHESE].

DONNÉES RÉELLES DISPONIBLES (issues INSEE + recherche web) :
${JSON.stringify(verifiedData, null, 2)}

KNOWLEDGE BASE INTERNE (statuts, banques, aides françaises) :
${knowledgeBase}

STRUCTURE OBLIGATOIRE — 20 sections (conformité bancaire) :
01. resume_executif — Synthèse percutante + chiffres clés
02. porteur_projet — Présentation du porteur (template à compléter)
03. presentation_projet — Origine, vision, mission
04. etude_marche — Marché chiffré avec sources
05. analyse_concurrentielle — Forces/faiblesses concurrents, positionnement
06. proposition_valeur — USP unique
07. modele_economique — Offres, pricing, business model
08. strategie_commerciale — Marketing, canaux, messaging
09. plan_acquisition — CAC, LTV, canaux prioritaires
10. aspects_juridiques — Statut recommandé avec justification
11. aspects_organisationnels — Équipe, locaux, sous-traitance
12. compte_resultat_3ans — An 1 mensuel + An 2/3 annuels (avec hypothèses)
13. plan_tresorerie_12mois — Entrées/sorties/solde mois par mois
14. plan_investissement — Besoins vs ressources
15. bilan_previsionnel — Actif/passif simplifié à 3 ans
16. seuil_rentabilite — Calcul détaillé : charges fixes ÷ taux de marge
17. risques — Top 5 risques + mitigations
18. plan_action_90jours — Semaine par semaine
19. aides_subventions — Aides applicables avec montants et liens officiels
20. annexes_checklist — Liste des documents à préparer pour dossier bancaire

LANGUE : Français, tutoiement, ton professionnel mais accessible.
SORTIE : JSON strictement valide avec une clé par section. Pas de markdown dans les clés. Les valeurs peuvent contenir du texte formaté.`;
}

// ── ÉTAPE 2 : WEB SEARCH ─────────────────────────────────────────────

async function performWebSearch(idea, sector, city, inseeData) {
  const searchPrompt = `Pour le projet suivant, recherche en ligne les données marché les plus récentes et fiables (sources françaises de préférence) :

PROJET : ${idea}
SECTEUR : ${sector}
VILLE / ZONE : ${city}

Données INSEE déjà disponibles : ${JSON.stringify(inseeData, null, 2)}

Recherche en priorité :
1. Taille du marché français pour ce secteur (chiffre récent avec source)
2. Taux de croissance annuel du secteur (2024-2026)
3. Prix moyens pratiqués / tarification du marché
4. Tendances consommateurs 2025-2026
5. Aides ou dispositifs spécifiques à ce secteur

Réponds UNIQUEMENT en JSON valide :
{
  "market_size": { "value": "...", "source": "...", "fiabilite": "VERIFIE|ESTIMATION" },
  "growth_rate": { "value": "...", "source": "...", "fiabilite": "VERIFIE|ESTIMATION" },
  "avg_pricing": { "value": "...", "note": "...", "fiabilite": "ESTIMATION" },
  "trends": ["...", "...", "..."],
  "specific_aids": ["...", "..."],
  "key_competitors_national": ["...", "...", "..."],
  "search_completed": true
}

Si une donnée n'est pas trouvable, mets value: null et fiabilite: "HYPOTHESE".`;

  try {
    // Appel avec outil web_search Anthropic (beta)
    const messages = [{ role: 'user', content: searchPrompt }];
    let finalText = null;
    let maxTurns = 8;

    while (maxTurns-- > 0) {
      const resp = await fetch(ANTHROPIC_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'web-search-2025-03-05',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 3000,
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
          messages,
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (!resp.ok) {
        const err = await resp.text();
        console.error('[web_search] API error:', err);
        return null;
      }

      const data = await resp.json();

      if (data.stop_reason === 'end_turn') {
        finalText = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
        break;
      }

      if (data.stop_reason === 'tool_use') {
        // Ajouter la réponse de l'assistant au fil de messages
        messages.push({ role: 'assistant', content: data.content });

        // Créer les tool_result pour chaque tool_use (web_search gère les résultats côté serveur)
        const toolResults = (data.content || [])
          .filter(c => c.type === 'tool_use')
          .map(c => ({
            type: 'tool_result',
            tool_use_id: c.id,
            content: c.output ? JSON.stringify(c.output) : 'Recherche effectuée',
          }));

        if (toolResults.length > 0) {
          messages.push({ role: 'user', content: toolResults });
        } else {
          break; // Éviter boucle infinie
        }
        continue;
      }

      break; // stop_reason inattendu
    }

    if (!finalText) return null;

    // Extraire le JSON de la réponse
    const start = finalText.indexOf('{');
    const end = finalText.lastIndexOf('}');
    if (start === -1 || end === -1) return null;

    try {
      return JSON.parse(jsonrepair(finalText.slice(start, end + 1)));
    } catch {
      return null;
    }
  } catch (e) {
    console.error('[web_search] Error:', e.message);
    return null;
  }
}

// ── ÉTAPE 3 : GÉNÉRATION DU PLAN ─────────────────────────────────────

function buildPlanPrompt(params, verifiedData) {
  const { idea, sector, city, budget, profile, time } = params;
  return `Génère un business plan EXCEPTIONNEL, ultra-complet et 100% actionnable pour cet entrepreneur français.

PROJET :
- Idée : ${idea}
- Secteur : ${sector}
- Ville / zone : ${city}
- Budget disponible : ${budget}
- Profil porteur : ${profile}
- Disponibilité : ${time}
- Date : France, ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}

DONNÉES MARCHÉ VÉRIFIÉES :
${JSON.stringify(verifiedData, null, 2)}

Génère les 20 sections du business plan en JSON valide.
Pour chaque chiffre : ajoute [Source : ...] si tu as une source, [Estimation IA] sinon.
Sois ultra-concret, avec des chiffres réalistes pour ce projet précis.
Pour les projections financières : liste tes hypothèses avant les chiffres.
Pour les aides : donne les montants réels et les liens officiels.`;
}

function extractJSON(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Pas de JSON dans la réponse');
  const raw = text.slice(start, end + 1);
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(jsonrepair(raw));
  }
}

// ── HANDLER PRINCIPAL ─────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const startTime = Date.now();

  try {
    const {
      idea = '', sector = '', city = '', budget = '',
      profile = '', time = '',
      model, messages, max_tokens, system, // champs venant du front legacy
    } = req.body;

    // ── Compatibilité avec l'ancien appel front (proxy.js) ──────────
    // Si le front envoie directement les messages Claude (ancien format)
    if (messages && Array.isArray(messages)) {
      const legacyResp = await fetch(ANTHROPIC_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(req.body),
      });
      const data = await legacyResp.json();
      if (!legacyResp.ok) return res.status(legacyResp.status).json(data);
      const text = (data.content || []).map(i => i.text || '').join('');
      try {
        const plan = extractJSON(text);
        return res.status(200).json({ ...data, content: [{ type: 'text', text: JSON.stringify(plan) }] });
      } catch (e) {
        return res.status(500).json({ error: { message: 'JSON invalide: ' + e.message } });
      }
    }

    // ── Nouveau pipeline 3 étapes ────────────────────────────────────
    if (!idea) return res.status(400).json({ error: 'Champ "idea" requis' });

    console.log(`[generate-plan] Début pipeline — ${idea.substring(0, 60)}...`);

    // ÉTAPE 1 — Données INSEE (parallèle avec étape 2)
    const inseePromise = fetchINSEEData(sector, city);

    // ÉTAPE 2 — Recherche web (en parallèle avec INSEE)
    const searchPromise = performWebSearch(idea, sector, city, {});

    const [inseeData, webData] = await Promise.all([inseePromise, searchPromise]);

    console.log(`[generate-plan] Données récupérées — INSEE: ${!!inseeData?.city}, Web: ${!!webData} — ${Date.now() - startTime}ms`);

    // Consolider les données
    const verifiedData = {
      insee: inseeData,
      web_search: webData,
      knowledge_base_used: true,
      generated_at: new Date().toISOString(),
    };

    // ÉTAPE 3 — Génération du plan
    const knowledgeBase = getKnowledgeContext();
    const systemPrompt = buildSystemPrompt(verifiedData, knowledgeBase);
    const userPrompt = buildPlanPrompt({ idea, sector, city, budget, profile, time }, verifiedData);

    const planResp = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 10000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!planResp.ok) {
      const err = await planResp.json();
      return res.status(planResp.status).json(err);
    }

    const planData = await planResp.json();
    const planText = (planData.content || []).map(c => c.text || '').join('');

    let plan;
    try {
      plan = extractJSON(planText);
    } catch (e) {
      return res.status(500).json({ error: { message: 'JSON invalide: ' + e.message } });
    }

    // Injecter les métadonnées de vérification dans le plan
    plan._meta = {
      verified_data: verifiedData,
      generation_ms: Date.now() - startTime,
      pipeline_version: '3-step-v1',
    };

    console.log(`[generate-plan] Plan généré — ${Date.now() - startTime}ms`);

    return res.status(200).json({
      ...planData,
      content: [{ type: 'text', text: JSON.stringify(plan) }],
    });

  } catch (err) {
    console.error('[generate-plan] Error:', err);
    return res.status(500).json({ error: { message: 'Erreur serveur: ' + err.message } });
  }
}

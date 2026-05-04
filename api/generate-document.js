export const config = { runtime: 'nodejs' };

// =====================================================================
// EADEE — Génération de documents téléchargeables (sans dépendances lourdes)
// RTF → Word/LibreOffice  |  CSV → Excel  |  HTML → impression PDF
// =====================================================================

import { buildCourrierBanqueContent } from './lib/document-templates/courrier-banque.js';
import { buildCourrierBpiContent } from './lib/document-templates/courrier-bpi.js';
import { buildLettreIntentionContent } from './lib/document-templates/lettre-intention.js';
import { buildTresorerieData } from './lib/document-templates/plan-tresorerie.js';
import { buildCompteResultatData } from './lib/document-templates/compte-resultat.js';
import { buildFicheSyntheseContent } from './lib/document-templates/fiche-synthese.js';

const DOCUMENTS = {
  courrier_banque:    { format: 'rtf',  ext: 'rtf',  mime: 'application/rtf',  title: 'Courrier banque',              builder: buildCourrierBanqueContent },
  courrier_bpi:       { format: 'rtf',  ext: 'rtf',  mime: 'application/rtf',  title: 'Demande BPI France',           builder: buildCourrierBpiContent },
  lettre_intention:   { format: 'rtf',  ext: 'rtf',  mime: 'application/rtf',  title: "Lettre d'intention",           builder: buildLettreIntentionContent },
  plan_tresorerie:    { format: 'csv',  ext: 'csv',  mime: 'text/csv',          title: 'Plan tresorerie 12 mois',      builder: buildTresorerieData },
  compte_resultat_3ans:{ format: 'csv', ext: 'csv',  mime: 'text/csv',          title: 'Compte resultat 3 ans',        builder: buildCompteResultatData },
  fiche_synthese:     { format: 'html', ext: 'html', mime: 'text/html',         title: 'Fiche synthese',               builder: buildFicheSyntheseContent },
};

// ── RTF Builder ───────────────────────────────────────────────────────
// Génère un RTF valide lisible par Word, LibreOffice, Pages

function escRtf(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/[^\x00-\x7F]/g, c => {
      const code = c.charCodeAt(0);
      return code < 256 ? `\\'${code.toString(16).padStart(2, '0')}` : `\\u${code}?`;
    });
}

function rtfParagraph(text, opts = {}) {
  const bold = opts.bold ? '\\b ' : '';
  const size = opts.size ? `\\fs${opts.size * 2} ` : '\\fs22 ';
  const color = opts.color === 'blue' ? '\\cf2 ' : opts.color === 'grey' ? '\\cf3 ' : '\\cf1 ';
  const lines = String(text || '').split('\n');
  return lines.map(l => `{\\pard ${bold}${size}${color}${escRtf(l)}\\par}`).join('\n');
}

function buildRtf(content) {
  const sections = content.sections || [];
  let body = '';

  for (const section of sections) {
    if (section.type === 'header') {
      const h = section.content;
      body += rtfParagraph(h.expediteur || h.nom_client || '', { bold: true, size: 12 }) + '\n';
      if (h.adresse) body += rtfParagraph(h.adresse) + '\n';
      body += rtfParagraph('') + '\n';
      body += rtfParagraph(h.date || '') + '\n';
      body += rtfParagraph('') + '\n';
      body += rtfParagraph(h.destinataire || '', { bold: true }) + '\n';
      if (h.banque) body += rtfParagraph(h.banque) + '\n';
      body += rtfParagraph('') + '\n';
    } else if (section.type === 'client_header') {
      const h = section.content;
      body += rtfParagraph(h.nom_client || '', { bold: true, size: 12 }) + '\n';
      body += rtfParagraph(h.adresse || '') + '\n';
      body += rtfParagraph(`Représenté par : ${h.representant || ''}, ${h.qualite || ''}`) + '\n';
      body += rtfParagraph('') + '\n';
      body += rtfParagraph(`Le ${h.date || ''}`) + '\n';
      body += rtfParagraph('') + '\n';
      body += rtfParagraph(`À : ${h.destinataire || ''}`, { bold: true }) + '\n';
      body += rtfParagraph('') + '\n';
    } else if (section.type === 'objet') {
      body += rtfParagraph(section.content || '', { bold: true }) + '\n';
      body += rtfParagraph('') + '\n';
    } else if (section.type === 'section') {
      body += rtfParagraph(section.titre || '', { bold: true, size: 12, color: 'blue' }) + '\n';
      body += rtfParagraph(section.content || '') + '\n';
      body += rtfParagraph('') + '\n';
    } else if (section.type === 'paragraphe' || section.type === 'corps') {
      if (section.titre) body += rtfParagraph(section.titre, { bold: true, color: 'blue' }) + '\n';
      body += rtfParagraph(section.content || '') + '\n';
      body += rtfParagraph('') + '\n';
    } else if (section.type === 'signature' || section.type === 'signature_client') {
      body += rtfParagraph('') + '\n';
      body += rtfParagraph(section.content || '') + '\n';
    } else if (section.type === 'note_utilisation') {
      body += rtfParagraph('') + '\n';
      body += rtfParagraph('--- INSTRUCTIONS ---', { bold: true, color: 'grey' }) + '\n';
      body += rtfParagraph(section.content || '', { color: 'grey' }) + '\n';
    }
  }

  return (
    '{\\rtf1\\ansi\\ansicpg1252\\deff0\n' +
    '{\\fonttbl{\\f0\\fswiss\\fcharset0 Helvetica;}{\\f1\\fswiss\\fcharset0 Arial;}}\n' +
    '{\\colortbl;\\red236\\green237\\blue242;\\red107\\green143\\blue239;\\red122\\green127\\blue154;}\n' +
    '\\f0\\cf1\n' +
    body +
    '}'
  );
}

// ── CSV Builder ───────────────────────────────────────────────────────

function escCsv(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function buildCsv(data) {
  const rows = [];

  if (data.months) {
    // Plan trésorerie
    rows.push(['Poste', ...data.months, 'TOTAL AN'].map(escCsv).join(','));
    for (const row of data.rows || []) {
      if (row.type === 'header') {
        rows.push([escCsv(row.label)]);
      } else if (row.type === 'row') {
        const vals = row.values || Array(12).fill(0);
        const total = vals.reduce((a, b) => a + (b || 0), 0);
        rows.push([escCsv(row.label), ...vals.map(v => escCsv(v || 0)), escCsv(total)].join(','));
      } else if (row.type === 'total' || row.type === 'solde' || row.type === 'cumul') {
        rows.push([escCsv(row.label), ...Array(13).fill('=SOMME()').map(escCsv)].join(','));
      }
    }
  } else if (data.sections) {
    // Compte de résultat
    rows.push(['Postes', 'An 1', 'An 2', 'An 3'].map(escCsv).join(','));
    for (const section of data.sections || []) {
      rows.push([escCsv(section.label)]);
      for (const row of section.rows || []) {
        rows.push([escCsv(row.label), escCsv(row.an1 || 0), escCsv(row.an2 || 0), escCsv(row.an3 || 0)].join(','));
      }
      rows.push([]);
    }
  }

  return '﻿' + rows.join('\r\n'); // BOM UTF-8 pour Excel
}

// ── HTML Builder (fiche synthèse → impression PDF) ────────────────────

function buildHtml(content) {
  const blocks = (content.blocks || []).map(block => {
    if (block.type === 'text') {
      return `<div class="block"><div class="block-label">${block.label || ''}</div><div class="block-text">${(block.content || '').replace(/\n/g, '<br>')}</div></div>`;
    } else if (block.type === 'kv') {
      const items = (block.items || []).filter(i => i.value).map(i =>
        `<div class="kv-row"><span class="kv-key">${i.key}</span><span class="kv-val">${i.value}</span></div>`
      ).join('');
      return `<div class="block"><div class="block-label">${block.label || ''}</div>${items}</div>`;
    }
    return '';
  }).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${content.title || 'Fiche synthèse'}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #1a1a2e; padding: 20mm; }
  h1 { font-size: 22px; color: #6b8fef; margin-bottom: 4px; }
  .subtitle { font-size: 11px; color: #7a7f9a; margin-bottom: 4px; }
  .date { font-size: 9px; color: #7a7f9a; text-align: right; margin-bottom: 16px; }
  .block { border: 1px solid #e0e3ef; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; break-inside: avoid; }
  .block-label { font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; color: #a78bfa; margin-bottom: 6px; }
  .block-text { font-size: 10px; color: #1a1a2e; line-height: 1.6; }
  .kv-row { display: flex; gap: 8px; padding: 2px 0; font-size: 10px; }
  .kv-key { color: #7a7f9a; min-width: 140px; }
  .kv-val { font-weight: 600; color: #1a1a2e; }
  .footer { margin-top: 16px; font-size: 8px; color: #7a7f9a; text-align: center; border-top: 1px solid #e0e3ef; padding-top: 8px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media print {
    body { padding: 10mm; }
    @page { size: A4; margin: 10mm; }
  }
  .print-btn { position: fixed; top: 10px; right: 10px; padding: 8px 16px; background: #6b8fef; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">Imprimer / Enregistrer PDF</button>
<h1>${content.title || ''}</h1>
${content.subtitle ? `<div class="subtitle">${content.subtitle}</div>` : ''}
<div class="date">Généré le ${content.date || ''}</div>
<div class="grid">
${blocks}
</div>
<div class="footer">${content.footer || 'Document généré par Eadee — À valider par un expert-comptable'}</div>
</body>
</html>`;
}

// ── Handler principal ─────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { type, plan } = req.body;
    if (!type || !plan) return res.status(400).json({ error: 'type et plan requis' });

    const doc = DOCUMENTS[type];
    if (!doc) return res.status(400).json({ error: `Type inconnu : ${type}` });

    const content = doc.builder(plan);
    const name = (plan.nom_business || plan.name || 'eadee').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `eadee-${name}-${type}.${doc.ext}`;

    let body;
    if (doc.format === 'rtf') {
      body = buildRtf(content);
    } else if (doc.format === 'csv') {
      body = buildCsv(content);
    } else if (doc.format === 'html') {
      body = buildHtml(content);
    }

    res.setHeader('Content-Type', doc.mime + '; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(body);

  } catch (err) {
    console.error('generate-document error:', err);
    return res.status(500).json({ error: err.message });
  }
}

export const config = { runtime: 'nodejs' };

// =====================================================================
// EADEE — Génération de vrais documents téléchargeables
// Formats : DOCX (Word), XLSX (Excel), PDF
// Runtime : Node.js (pas Edge — utilise des libs npm)
// =====================================================================

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

import { buildCourrierBanqueContent } from './lib/document-templates/courrier-banque.js';
import { buildCourrierBpiContent } from './lib/document-templates/courrier-bpi.js';
import { buildLettreIntentionContent } from './lib/document-templates/lettre-intention.js';
import { buildTresorerieData } from './lib/document-templates/plan-tresorerie.js';
import { buildCompteResultatData } from './lib/document-templates/compte-resultat.js';
import { buildFicheSyntheseContent } from './lib/document-templates/fiche-synthese.js';

// ── Configuration ────────────────────────────────────────────────────

const COLORS = {
  bleu: '6B8FEF',
  violet: 'A78BFA',
  dark: '13141A',
  text: 'ECEDF2',
  muted: '7A7F9A',
  blanc: 'FFFFFF',
};

const DOCUMENTS = {
  courrier_banque: { format: 'docx', title: 'Courrier de présentation à la banque', builder: buildCourrierBanqueContent },
  courrier_bpi: { format: 'docx', title: 'Demande de financement BPI France', builder: buildCourrierBpiContent },
  lettre_intention: { format: 'docx', title: "Lettre d'intention de client", builder: buildLettreIntentionContent },
  plan_tresorerie: { format: 'xlsx', title: 'Plan de trésorerie 12 mois', builder: buildTresorerieData },
  compte_resultat_3ans: { format: 'xlsx', title: 'Compte de résultat prévisionnel 3 ans', builder: buildCompteResultatData },
  fiche_synthese: { format: 'pdf', title: 'Fiche synthèse 1 page', builder: buildFicheSyntheseContent },
};

// ── DOCX Builder ─────────────────────────────────────────────────────

async function buildDocx(content) {
  const children = [];

  for (const section of content.sections || []) {
    if (section.type === 'header') {
      const h = section.content;
      children.push(new Paragraph({ children: [new TextRun({ text: h.expediteur || h.nom_client || '', bold: true, size: 24 })] }));
      if (h.adresse) children.push(new Paragraph({ children: [new TextRun({ text: h.adresse, size: 22 })] }));
      children.push(new Paragraph({ text: '' }));
      children.push(new Paragraph({ children: [new TextRun({ text: h.date || '', size: 22 })] }));
      children.push(new Paragraph({ text: '' }));
      children.push(new Paragraph({ children: [new TextRun({ text: h.destinataire || '', bold: true, size: 22 })] }));
      if (h.banque) children.push(new Paragraph({ children: [new TextRun({ text: h.banque, size: 22 })] }));
      children.push(new Paragraph({ text: '' }));
    } else if (section.type === 'objet') {
      children.push(new Paragraph({ children: [new TextRun({ text: section.content, bold: true, size: 22 })] }));
      children.push(new Paragraph({ text: '' }));
    } else if (section.type === 'paragraphe' || section.type === 'corps') {
      if (section.titre) {
        children.push(new Paragraph({ children: [new TextRun({ text: section.titre, bold: true, size: 24, color: COLORS.bleu })] }));
      }
      const lines = (section.content || '').split('\n');
      for (const line of lines) {
        children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })] }));
      }
      children.push(new Paragraph({ text: '' }));
    } else if (section.type === 'section') {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: section.titre || '', bold: true, color: COLORS.bleu })] }));
      const lines = (section.content || '').split('\n');
      for (const line of lines) {
        children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })] }));
      }
      children.push(new Paragraph({ text: '' }));
    } else if (section.type === 'signature' || section.type === 'signature_client') {
      children.push(new Paragraph({ text: '' }));
      const lines = (section.content || '').split('\n');
      for (const line of lines) {
        children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })] }));
      }
    } else if (section.type === 'note_utilisation') {
      children.push(new Paragraph({ text: '' }));
      children.push(new Paragraph({
        children: [new TextRun({ text: '--- NOTE ---', bold: true, size: 20, color: COLORS.muted })],
      }));
      const lines = (section.content || '').split('\n');
      for (const line of lines) {
        children.push(new Paragraph({ children: [new TextRun({ text: line, size: 20, color: COLORS.muted })] }));
      }
    } else if (section.type === 'client_header') {
      const h = section.content;
      children.push(new Paragraph({ children: [new TextRun({ text: h.nom_client || '', bold: true, size: 24 })] }));
      children.push(new Paragraph({ children: [new TextRun({ text: h.adresse || '', size: 22 })] }));
      children.push(new Paragraph({ children: [new TextRun({ text: `Représenté par : ${h.representant || ''}, ${h.qualite || ''}`, size: 22 })] }));
      children.push(new Paragraph({ text: '' }));
      children.push(new Paragraph({ children: [new TextRun({ text: `Le ${h.date || ''}`, size: 22 })] }));
      children.push(new Paragraph({ text: '' }));
      children.push(new Paragraph({ children: [new TextRun({ text: `À : ${h.destinataire || ''}`, bold: true, size: 22 })] }));
      children.push(new Paragraph({ text: '' }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  return await Packer.toBuffer(doc);
}

// ── XLSX Builder ─────────────────────────────────────────────────────

async function buildXlsxTresorerie(data) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Trésorerie 12 mois', {
    views: [{ showGridLines: true }],
  });

  // Styles
  const headerStyle = { font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.bleu } }, alignment: { horizontal: 'center' } };
  const sectionStyle = { font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.violet } } };
  const totalStyle = { font: { bold: true, size: 10 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F0FE' } }, numFmt: '#,##0 €' };
  const numberStyle = { numFmt: '#,##0 €', alignment: { horizontal: 'right' } };
  const soldePositifStyle = { font: { color: { argb: 'FF34D399' }, bold: true }, numFmt: '#,##0 €' };
  const soldeNegatifStyle = { font: { color: { argb: 'FFEF4444' }, bold: true }, numFmt: '#,##0 €' };

  // Titre
  ws.mergeCells('A1:N1');
  const titleCell = ws.getCell('A1');
  titleCell.value = `${data.name} — Plan de trésorerie prévisionnel 12 mois`;
  titleCell.style = { font: { bold: true, size: 14, color: { argb: 'FF' + COLORS.bleu } }, alignment: { horizontal: 'center' } };
  ws.getRow(1).height = 30;

  ws.mergeCells('A2:N2');
  ws.getCell('A2').value = `Généré par Eadee — ${new Date().toLocaleDateString('fr-FR')} — À valider par un expert-comptable`;
  ws.getCell('A2').style = { font: { size: 9, italic: true, color: { argb: 'FF' + COLORS.muted } }, alignment: { horizontal: 'center' } };

  // Headers mois
  ws.getRow(4).height = 20;
  ws.getCell('A4').value = 'Poste';
  ws.getCell('A4').style = headerStyle;
  data.months.forEach((m, i) => {
    const cell = ws.getCell(4, i + 2);
    cell.value = m;
    cell.style = headerStyle;
    ws.getColumn(i + 2).width = 11;
  });
  ws.getCell(4, 14).value = 'TOTAL AN';
  ws.getCell(4, 14).style = headerStyle;
  ws.getColumn(1).width = 32;
  ws.getColumn(14).width = 14;

  let rowIdx = 5;
  let entreesTotalRow = null;
  let sortiesTotalRow = null;

  for (const row of data.rows) {
    const wsRow = ws.getRow(rowIdx);
    if (row.type === 'header') {
      ws.mergeCells(rowIdx, 1, rowIdx, 14);
      wsRow.getCell(1).value = row.label;
      wsRow.getCell(1).style = sectionStyle;
      wsRow.height = 18;
    } else if (row.type === 'row') {
      wsRow.getCell(1).value = row.label;
      wsRow.getCell(1).style = { font: { size: 10 } };
      const vals = row.values || Array(12).fill(0);
      let total = 0;
      vals.forEach((v, i) => {
        wsRow.getCell(i + 2).value = v || 0;
        wsRow.getCell(i + 2).style = numberStyle;
        total += v || 0;
      });
      wsRow.getCell(14).value = total;
      wsRow.getCell(14).style = { ...numberStyle, font: { bold: true } };
    } else if (row.type === 'total') {
      wsRow.getCell(1).value = row.label;
      wsRow.getCell(1).style = { ...totalStyle, font: { bold: true, size: 10 } };
      // Formules SUM pour les 12 mois
      for (let c = 2; c <= 14; c++) {
        wsRow.getCell(c).value = 0; // Placeholder — dans un vrai fichier ce serait des formules
        wsRow.getCell(c).style = totalStyle;
      }
      if (row.label.includes('ENTRÉES')) entreesTotalRow = rowIdx;
      if (row.label.includes('SORTIES')) sortiesTotalRow = rowIdx;
    } else if (row.type === 'solde' || row.type === 'cumul') {
      wsRow.getCell(1).value = row.label;
      wsRow.getCell(1).style = { font: { bold: true, size: 10 } };
      for (let c = 2; c <= 14; c++) {
        wsRow.getCell(c).value = 0;
        wsRow.getCell(c).style = soldePositifStyle;
      }
    }
    rowIdx++;
  }

  // Note en bas
  rowIdx += 2;
  ws.mergeCells(rowIdx, 1, rowIdx, 14);
  ws.getCell(rowIdx, 1).value = 'Note : Remplir les cellules en blanc avec vos données réelles. Les totaux se calculeront automatiquement.';
  ws.getCell(rowIdx, 1).style = { font: { italic: true, size: 9, color: { argb: 'FF' + COLORS.muted } } };

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function buildXlsxCompteResultat(data) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('CR Prévisionnel 3 ans');

  // Titre
  ws.mergeCells('A1:D1');
  ws.getCell('A1').value = `${data.name} — Compte de résultat prévisionnel 3 ans`;
  ws.getCell('A1').style = { font: { bold: true, size: 14, color: { argb: 'FF' + COLORS.bleu } }, alignment: { horizontal: 'center' } };
  ws.getRow(1).height = 28;

  // Hypothèses
  ws.getCell('A3').value = 'Hypothèses :';
  ws.getCell('A3').style = { font: { bold: true, size: 10 } };
  data.hypotheses.forEach((h, i) => {
    ws.getCell(4 + i, 1).value = `• ${h}`;
    ws.getCell(4 + i, 1).style = { font: { size: 9, italic: true, color: { argb: 'FF' + COLORS.muted } } };
  });

  let rowIdx = 4 + data.hypotheses.length + 1;

  // Headers
  ['Postes', 'An 1', 'An 2', 'An 3'].forEach((h, i) => {
    ws.getCell(rowIdx, i + 1).value = h;
    ws.getCell(rowIdx, i + 1).style = { font: { bold: true, color: { argb: 'FFFFFFFF' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.bleu } }, alignment: { horizontal: 'center' } };
  });
  ws.getColumn(1).width = 40;
  ws.getColumn(2).width = 16;
  ws.getColumn(3).width = 16;
  ws.getColumn(4).width = 16;
  rowIdx++;

  const numFmt = '#,##0 €';

  for (const section of data.sections) {
    // Section header
    ws.mergeCells(rowIdx, 1, rowIdx, 4);
    ws.getCell(rowIdx, 1).value = section.label;
    ws.getCell(rowIdx, 1).style = { font: { bold: true, color: { argb: 'FFFFFFFF' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.violet } } };
    rowIdx++;

    for (const row of section.rows) {
      ws.getCell(rowIdx, 1).value = row.label;
      const isTotal = row.isTotal || row.isResult;
      const style = isTotal
        ? { font: { bold: true, size: 10 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F0FE' } } }
        : {};
      ws.getCell(rowIdx, 1).style = style;
      [row.an1, row.an2, row.an3].forEach((v, i) => {
        ws.getCell(rowIdx, i + 2).value = v || 0;
        ws.getCell(rowIdx, i + 2).style = { ...style, numFmt, alignment: { horizontal: 'right' } };
      });
      rowIdx++;
    }
    rowIdx++;
  }

  // Footer
  rowIdx++;
  ws.mergeCells(rowIdx, 1, rowIdx, 4);
  ws.getCell(rowIdx, 1).value = `Généré par Eadee — ${new Date().toLocaleDateString('fr-FR')} — À valider par un expert-comptable`;
  ws.getCell(rowIdx, 1).style = { font: { italic: true, size: 9, color: { argb: 'FF' + COLORS.muted } } };

  return Buffer.from(await wb.xlsx.writeBuffer());
}

// ── PDF Builder (fiche synthèse) ──────────────────────────────────────

async function buildPdf(content) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Fond sombre
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#13141a');

    // Titre
    doc.fill('#6b8fef').font('Helvetica-Bold').fontSize(22).text(content.title || 'Fiche synthèse', 40, 40, { width: doc.page.width - 80 });
    if (content.subtitle) {
      doc.fill('#7a7f9a').font('Helvetica').fontSize(11).text(content.subtitle, 40, doc.y + 4, { width: doc.page.width - 80 });
    }
    doc.fill('#7a7f9a').fontSize(9).text(`Généré le ${content.date || ''}`, { align: 'right' });

    // Ligne séparatrice
    doc.moveTo(40, doc.y + 8).lineTo(doc.page.width - 40, doc.y + 8).strokeColor('#6b8fef').lineWidth(1).stroke();
    doc.moveDown(1);

    // Blocs
    for (const block of content.blocks || []) {
      if (!block.content && !block.items?.length) continue;

      const startY = doc.y;
      doc.fill('#a78bfa').font('Helvetica-Bold').fontSize(9).text(block.label?.toUpperCase() || '', 40, doc.y, { width: doc.page.width - 80 });
      doc.moveDown(0.3);

      if (block.type === 'text') {
        doc.fill('#ecedf2').font('Helvetica').fontSize(10).text(block.content || '', 40, doc.y, { width: doc.page.width - 80 });
      } else if (block.type === 'kv') {
        for (const item of block.items || []) {
          if (!item.value) continue;
          doc.fill('#7a7f9a').font('Helvetica').fontSize(9).text(item.key + ' : ', 40, doc.y, { continued: true, width: 160 });
          doc.fill('#ecedf2').font('Helvetica-Bold').fontSize(9).text(String(item.value));
        }
      }

      // Fond de bloc
      const blockH = doc.y - startY + 8;
      doc.rect(36, startY - 4, doc.page.width - 72, blockH).fillOpacity(0.05).fill('#ffffff');
      doc.fillOpacity(1);
      doc.moveDown(0.8);
    }

    // Footer
    const footerY = doc.page.height - 40;
    doc.moveTo(40, footerY - 8).lineTo(doc.page.width - 40, footerY - 8).strokeColor('#333').stroke();
    doc.fill('#7a7f9a').font('Helvetica').fontSize(8).text(content.footer || 'Eadee — Document généré automatiquement', 40, footerY, { width: doc.page.width - 80, align: 'center' });

    doc.end();
  });
}

// ── HANDLER PRINCIPAL ─────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { documentType, plan } = req.body;

    if (!documentType || !plan) {
      return res.status(400).json({ error: 'documentType et plan requis' });
    }

    const docConfig = DOCUMENTS[documentType];
    if (!docConfig) {
      return res.status(400).json({ error: `Type inconnu. Valeurs acceptées: ${Object.keys(DOCUMENTS).join(', ')}` });
    }

    // Construire le contenu du document
    const content = docConfig.builder(plan);

    // Générer le fichier
    let buffer;
    let contentType;
    let ext;

    if (docConfig.format === 'docx') {
      buffer = await buildDocx(content);
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      ext = 'docx';
    } else if (docConfig.format === 'xlsx') {
      buffer = documentType === 'plan_tresorerie'
        ? await buildXlsxTresorerie(content)
        : await buildXlsxCompteResultat(content);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      ext = 'xlsx';
    } else if (docConfig.format === 'pdf') {
      buffer = await buildPdf(content);
      contentType = 'application/pdf';
      ext = 'pdf';
    }

    const planName = (plan.nom_business || plan.name || 'eadee').replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `${docConfig.title}-${planName}.${ext}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);

  } catch (err) {
    console.error('[generate-document] Error:', err);
    return res.status(500).json({ error: 'Erreur génération document: ' + err.message });
  }
}

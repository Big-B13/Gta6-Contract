// Shared measurement/drawing layout prevents long content from colliding with the footer.
export function wrapText(ctx, text, width) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/u)) {
    if (!word) continue;
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= width) { line = candidate; continue; }
    if (line) { lines.push(line); line = ''; }
    // Split even an unbroken name using Unicode code points.
    for (const character of word) {
      if (line && ctx.measureText(line + character).width > width) {
        lines.push(line); line = '';
      }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}
export function createAgreement(terms, signature, date = new Date()) {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser does not support image generation.');
  const rows = [];
  let y = 160;
  function paragraph(text, { font = '26px Arial', color = '#20252b', gap = 24 } = {}) {
    ctx.font = font;
    const lines = wrapText(ctx, text, 1080);
    for (const line of lines) { rows.push({ text: line, y, font, color }); y += 42; }
    y += gap;
  }
  function heading(text) { paragraph(text, { font: 'bold 32px Arial', color: '#b14e76' }); }
  paragraph('THE NOVEMBER AGREEMENT', { font: 'bold 52px Georgia', gap: 12 });
  paragraph('RELATIONSHIP AND GAMING TIME TERMS', { font: '24px Arial', color: '#68717a', gap: 42 });
  paragraph(`Date: ${date.toLocaleDateString('en-GB')}`);
  heading('1. PURPOSE');
  paragraph('This agreement records a playful, mutual understanding about GTA 6 gaming time during November.');
  heading('2. AGREED TERMS');
  terms.forEach((term, i) => paragraph(`${i + 1}. ${term}`));
  heading('3. GOOD FAITH');
  paragraph('Both people agree to communicate, respect boundaries, and remember that the relationship comes first.');
  heading('4. ELECTRONIC SIGNATURE');
  paragraph(signature, { font: 'italic 36px cursive', color: '#263d74', gap: 48 });
  paragraph('A humorous relationship agreement — not legal advice or a binding legal contract.', { font: '20px Arial', color: '#68717a' });
  canvas.height = Math.max(1900, Math.ceil(y + 100));
  ctx.fillStyle = '#f8f5ed'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#d2c7b5'; ctx.lineWidth = 8;
  ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);
  ctx.fillStyle = '#b14e76'; ctx.fillRect(55, 55, canvas.width - 110, 22);
  for (const row of rows) {
    ctx.font = row.font; ctx.fillStyle = row.color; ctx.fillText(row.text, 160, row.y);
  }
  return canvas.toDataURL('image/png');
}

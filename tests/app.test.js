import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, navigate, back, agreedTerms, defaultTerms, conditionOptions } from '../state.js';
import { wrapText, createAgreement } from '../agreement.js';

test('Back follows the actual route, including skipped explanation', () => {
  const state = createState();
  navigate(state, 'proposal'); back(state);
  assert.equal(state.screen, 'knowledge');
  navigate(state, 'explanation'); navigate(state, 'proposal'); back(state);
  assert.equal(state.screen, 'explanation');
});
test('Both approval routes return to their original screen and preserve values', () => {
  const state = createState();
  navigate(state, 'permission'); state.terms = [...defaultTerms]; navigate(state, 'contract'); back(state);
  assert.equal(state.screen, 'permission');
  navigate(state, 'conditions'); state.conditions = [...conditionOptions];
  state.terms = agreedTerms(state.conditions); navigate(state, 'contract'); state.signature = 'Test Name';
  back(state);
  assert.deepEqual(state.conditions, conditionOptions);
  assert.equal(state.signature, 'Test Name');
  assert.equal(state.screen, 'conditions');
});
test('Declining is a real destination and restart produces clean state', () => {
  for (const screen of ['proposal', 'permission']) {
    const state = createState(); navigate(state, screen); navigate(state, 'declined');
    assert.equal(state.screen, 'declined'); back(state); assert.equal(state.screen, screen);
  }
  assert.deepEqual(createState().history, []);
  assert.equal(createState().signature, '');
});
test('No conditions produces a discussion term; saved terms do not alias selections', () => {
  assert.equal(agreedTerms([]).length, 1);
  const selected = ['Dates first']; const terms = agreedTerms(selected); selected.push('Chores');
  assert.deepEqual(terms, ['Dates first']);
});
test('Text wrapping handles long words, Unicode and empty text', () => {
  const ctx = { measureText: text => ({ width: [...text].length * 10 }) };
  for (const text of ['A long sentence with spaces', 'x'.repeat(120), '😀'.repeat(120)]) {
    const lines = wrapText(ctx, text, 100);
    assert.ok(lines.every(line => ctx.measureText(line).width <= 100));
    assert.equal(lines.join('').replaceAll(' ', ''), text.replaceAll(' ', ''));
  }
  assert.deepEqual(wrapText(ctx, '', 100), []);
});
test('All conditions and a long signature fit above the bottom border', () => {
  const rows = [];
  const canvas = { width: 0, height: 0, toDataURL: () => 'data:image/png;base64,test' };
  const ctx = { measureText: text => ({ width: [...text].length * 40 }), fillRect() {}, strokeRect() {}, fillText(text, x, y) { rows.push({text, y}); } };
  canvas.getContext = () => ctx;
  globalThis.document = { createElement: () => canvas };
  try {
    assert.match(createAgreement(conditionOptions, 'W'.repeat(120)), /^data:image\/png/);
    assert.ok(canvas.height > 1900);
    assert.ok(rows.every(row => row.y < canvas.height - 100));
  } finally { delete globalThis.document; }
});

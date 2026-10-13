const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { MISSIONS } = require('../data/missions.js');

test('the workshop runs for exactly 240 minutes', () => {
  const total = MISSIONS.reduce((sum, m) => sum + (m.end - m.start), 0);
  assert.strictEqual(total, 240);
});

test('the timeline has no gaps or overlaps', () => {
  assert.strictEqual(MISSIONS[0].start, 0);
  assert.strictEqual(MISSIONS[MISSIONS.length - 1].end, 240);
  for (let i = 1; i < MISSIONS.length; i++) {
    assert.strictEqual(MISSIONS[i].start, MISSIONS[i - 1].end, `${MISSIONS[i].id} should start when ${MISSIONS[i - 1].id} ends`);
  }
});

test('there are 8 missions and 3 boss battles', () => {
  assert.strictEqual(MISSIONS.filter((m) => m.type === 'mission').length, 8);
  assert.strictEqual(MISSIONS.filter((m) => m.type === 'boss').length, 3);
});

test('the landing page shows the workshop title', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /PUSH YOUR/);
  assert.match(html, /LIMITS/);
});

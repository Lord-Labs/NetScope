import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderTokens } from '../generate-tokens.mjs';
import { validateBacklog, issueBody } from '../planning.mjs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const read = (path) => JSON.parse(readFileSync(resolve(path), 'utf8'));
const plan = read('planning/backlog.json');
const tokens = read('design/tokens.json');

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('semantic body/status/action colors remain readable in both themes', () => {
  for (const [name, palette] of Object.entries(tokens.colors)) {
    for (const background of ['background', 'surface', 'surfaceMuted']) {
      for (const foreground of ['foreground', 'textSecondary', 'textMuted', 'success', 'warning', 'danger']) {
        assert.ok(contrast(palette[foreground], palette[background]) >= 4.5, `${name}/${foreground}/${background}`);
      }
    }
    assert.ok(contrast(palette.accent, palette.accentForeground) >= 4.5);
    assert.ok(contrast(palette.borderStrong, palette.surface) >= 3);
  }
});

test('generated CSS contains both source palettes and shared spacing', () => {
  const rendered = renderTokens(tokens);
  assert.ok(rendered.css.includes(`--accent: ${tokens.colors.light.accent};`));
  assert.ok(rendered.css.includes(`--accent: ${tokens.colors.dark.accent};`));
  assert.ok(rendered.css.includes(`--spacing-xl: ${tokens.spacing.xl}px;`));
});

test('backlog rejects duplicate IDs, missing dependencies and cycles', () => {
  assert.equal(validateBacklog(plan), true);
  const duplicate = structuredClone(plan);
  duplicate.issues.push(duplicate.issues[0]);
  assert.throws(() => validateBacklog(duplicate), /Duplicate issue/);
  const missing = structuredClone(plan);
  missing.issues[0].depends_on = ['DOES_NOT_EXIST'];
  assert.throws(() => validateBacklog(missing), /Unknown dependency/);
  const cycle = structuredClone(plan);
  cycle.issues[0].depends_on = [cycle.issues[1].key];
  assert.throws(() => validateBacklog(cycle), /Dependency cycle/);
});

test('issue rendering carries real dependency links and acceptance/evidence', () => {
  const issue = plan.issues.find((item) => item.key === 'G01');
  const body = issueBody(issue, plan, { issues: { F01: { url: 'https://github.com/example/repo/issues/1' } } });
  assert.ok(body.includes('[F01](https://github.com/example/repo/issues/1)'));
  assert.ok(body.includes(issue.acceptance[0]));
  assert.ok(body.includes('## Validation and evidence'));
});

const validator = new Ajv2020({ strict: true, allErrors: true });
addFormats(validator);
const validMeasurement = validator.compile(read('packages/contracts/measurement.schema.json'));
test('measurement schema keeps gaps distinct from measured zero and preserves byte precision', () => {
  const reading = read('packages/contracts/fixtures/reading.json');
  const gap = read('packages/contracts/fixtures/gap.json');
  assert.equal(validMeasurement(reading), true, JSON.stringify(validMeasurement.errors));
  assert.equal(validMeasurement(gap), true, JSON.stringify(validMeasurement.errors));
  assert.equal(validMeasurement({ ...reading, rx_bytes: '0', tx_bytes: '0' }), true);
  assert.equal(validMeasurement({ ...reading, rx_bytes: '9007199254740993' }), true);
  assert.equal(validMeasurement({ ...reading, rx_bytes: 9007199254740992 }), false);
  assert.equal(validMeasurement({ ...gap, rx_bytes: '0', tx_bytes: '0' }), false);
  assert.equal(validMeasurement({ ...gap, coverage: 'complete' }), false);
  assert.equal(validMeasurement({ ...reading, rx_bytes: '-1' }), false);
  assert.equal(validMeasurement({ ...reading, extra: 'unexpected' }), false);
});

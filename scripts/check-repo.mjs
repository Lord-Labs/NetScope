import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBacklog } from './planning.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = ['AGENTS.md', 'README.md', 'README.ar.md', 'LICENSE', 'SECURITY.md',
  'docs/START_HERE.md', 'docs/STATE.md', 'docs/ROADMAP.md', 'docs/DEVELOPMENT.md',
  'docs/DESIGN_SYSTEM.md', 'planning/backlog.json', 'planning/ISSUES.md',
  'design/tokens.json', 'design/tokens.css', 'apps/client/lib/design/tokens.g.dart',
  'packages/contracts/measurement.schema.json', 'packages/contracts/openapi.json'];
for (const file of required) assert.ok(existsSync(resolve(root, file)), `Missing ${file}`);
validateBacklog(JSON.parse(readFileSync(resolve(root, 'planning/backlog.json'), 'utf8')));

const ignored = new Set(['.git', '.tools', '.local', 'node_modules', 'build', 'dist',
  '.dart_tool', '.wrangler', '.gradle', 'target', 'ephemeral']);
let links = 0;
function walk(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(item.name)) continue;
    const path = resolve(directory, item.name);
    if (item.isDirectory()) walk(path);
    if (!item.isFile() || !item.name.endsWith('.md')) continue;
    const content = readFileSync(path, 'utf8');
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const href = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) continue;
      const target = decodeURIComponent(href.split('#')[0]);
      if (!target) continue;
      const destination = resolve(dirname(path), target);
      assert.ok(existsSync(destination), `Broken link in ${relative(root, path)}: ${href}`);
      assert.ok(!relative(root, destination).startsWith(`..${sep}`), 'Link escapes workspace');
      links += 1;
    }
  }
}
walk(root);
const spec = JSON.parse(readFileSync(resolve(root, 'packages/contracts/openapi.json'), 'utf8'));
assert.deepEqual(Object.keys(spec.paths), ['/health'], 'Only implemented routes belong in foundation OpenAPI');
assert.ok(statSync(resolve(root, 'LICENSE')).size > 100);
console.log(`Repository checks passed; ${links} local Markdown links verified.`);

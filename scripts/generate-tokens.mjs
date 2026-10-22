import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(resolve(root, 'design/tokens.json'), 'utf8'));
const kebab = (name) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export function renderTokens(source) {
  const css = ['/* Generated from design/tokens.json. Do not edit. */'];
  for (const [theme, colors] of Object.entries(source.colors)) {
    css.push(theme === 'light' ? ':root, :root[data-theme="light"] {' : ':root[data-theme="dark"] {');
    for (const [name, value] of Object.entries(colors)) css.push(`  --${kebab(name)}: ${value};`);
    css.push('}');
  }
  css.push(':root {');
  for (const section of ['spacing', 'radius', 'type', 'motion', 'layout']) {
    for (const [name, value] of Object.entries(source[section])) {
      const unit = section === 'motion' ? 'ms' : section === 'type' ? 'rem' : 'px';
      css.push(`  --${section}-${kebab(name)}: ${section === 'type' ? value / 16 : value}${unit};`);
    }
  }
  css.push('}', '');

  return { css: css.join('\n') };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rendered = renderTokens(tokens);
  const outputs = {
    'design/tokens.css': rendered.css,
  };
  for (const [name, content] of Object.entries(outputs)) {
    const path = resolve(root, name);
    if (process.argv.includes('--check')) {
      if (readFileSync(path, 'utf8').replaceAll('\r\n', '\n') !== content) {
        throw new Error(`${name} is stale; run npm run tokens:generate`);
      }
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
  }
  console.log(process.argv.includes('--check') ? 'Design tokens match.' : 'Generated shared CSS tokens.');
}

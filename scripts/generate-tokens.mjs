import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(resolve(root, 'design/tokens.json'), 'utf8'));
const kebab = (name) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export function renderTokens(source) {
  const css = ['/* Generated from design/tokens.json. Do not edit. */'];
  for (const [theme, colors] of Object.entries(source.colors)) {
    css.push(theme === 'light' ? ':root {' : '[data-theme="dark"] {');
    for (const [name, value] of Object.entries(colors)) css.push(`  --${kebab(name)}: ${value};`);
    css.push('}');
  }
  css.push(':root {');
  for (const section of ['spacing', 'radius', 'type', 'motion', 'layout']) {
    for (const [name, value] of Object.entries(source[section])) {
      css.push(`  --${section}-${kebab(name)}: ${value}${section === 'motion' ? 'ms' : 'px'};`);
    }
  }
  css.push('}', '');

  const dart = [
    '// Generated from design/tokens.json. Do not edit.',
    "import 'package:flutter/painting.dart';", '',
    'abstract final class NetScopeTokens {',
  ];
  for (const [theme, colors] of Object.entries(source.colors)) {
    for (const [name, value] of Object.entries(colors)) {
      dart.push(`  static const ${theme}${name[0].toUpperCase()}${name.slice(1)} = Color(0xFF${value.slice(1)});`);
    }
  }
  for (const section of ['spacing', 'radius', 'type', 'motion', 'layout']) {
    for (const [name, value] of Object.entries(source[section])) {
      dart.push(`  static const ${section}${name[0].toUpperCase()}${name.slice(1)} = ${value}${section === 'motion' ? '' : '.0'};`);
    }
  }
  dart.push('}', '');
  return { css: css.join('\n'), dart: dart.join('\n') };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rendered = renderTokens(tokens);
  const outputs = {
    'design/tokens.css': rendered.css,
    'apps/client/lib/design/tokens.g.dart': rendered.dart,
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
  console.log(process.argv.includes('--check') ? 'Design tokens match.' : 'Generated Dart and CSS tokens.');
}

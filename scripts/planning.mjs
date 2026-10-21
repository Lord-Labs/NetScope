import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function validateBacklog(plan) {
  const milestones = new Set(plan.milestones.map((item) => item.key));
  if (milestones.size !== plan.milestones.length) throw new Error('Duplicate milestone key');
  const issues = new Map();
  for (const issue of plan.issues) {
    if (issues.has(issue.key)) throw new Error(`Duplicate issue key ${issue.key}`);
    if (!milestones.has(issue.milestone)) throw new Error(`Unknown milestone for ${issue.key}`);
    for (const field of ['key', 'title', 'goal', 'priority', 'type', 'area']) {
      if (typeof issue[field] !== 'string' || !issue[field].trim()) throw new Error(`Missing ${field} in ${issue.key}`);
    }
    for (const field of ['paths', 'acceptance', 'validation', 'non_goals']) {
      if (!Array.isArray(issue[field]) || issue[field].length === 0) throw new Error(`Missing ${field} in ${issue.key}`);
    }
    if (!Array.isArray(issue.depends_on)) throw new Error(`Missing dependencies in ${issue.key}`);
    issues.set(issue.key, issue);
  }
  const active = new Set();
  const done = new Set();
  function visit(key) {
    if (active.has(key)) throw new Error(`Dependency cycle at ${key}`);
    if (done.has(key)) return;
    const issue = issues.get(key);
    if (!issue) throw new Error(`Unknown dependency ${key}`);
    active.add(key);
    for (const dependency of issue.depends_on) visit(dependency);
    active.delete(key);
    done.add(key);
  }
  for (const key of issues.keys()) visit(key);
  return true;
}

export function issueBody(issue, plan, published = {}) {
  const base = `https://github.com/${plan.repository}/blob/main/`;
  const dependency = (key) => published.issues?.[key]?.url
    ? `[${key}](${published.issues[key].url})` : key;
  return [
    `<!-- netscope-issue:${issue.key} -->`,
    '## Goal', issue.goal, '',
    '## Required context',
    `Read [AGENTS](${base}AGENTS.md), [current state](${base}docs/STATE.md), and [roadmap](${base}docs/ROADMAP.md).`,
    'Flutter app, native measurement, no VPN/router/root, no Student Pack. Scope and coverage must remain honest.', '',
    '## Dependencies',
    issue.depends_on.length ? `Blocked by: ${issue.depends_on.map(dependency).join(', ')}. Recheck live acceptance before starting.` : 'None.', '',
    '## Scope / likely files', ...issue.paths.map((path) => `- \`${path}\``), '',
    '## Acceptance criteria', ...issue.acceptance.map((item) => `- [ ] ${item}`), '',
    '## Validation and evidence', ...issue.validation.map((item) => `- ${item}`), '',
    '## Non-goals', ...issue.non_goals.map((item) => `- ${item}`), '',
    '## Handoff / definition of done',
    '- Link focused PRs and tests actually run; identify untested platforms and remaining limits.',
    '- Update docs/STATE.md when behavior changes. Hardware gates require real redacted evidence, not CI alone.',
    '- Follow Ponytail: smallest complete change, no speculative abstractions/dependencies, preserve validation and durability.',
    `- Planning key: \`${issue.key}\`. Live discussion/acceptance in this issue supersedes the initial seed after a reviewed scope change.`, '',
  ].join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const plan = JSON.parse(readFileSync(resolve(root, 'planning/backlog.json'), 'utf8'));
  validateBacklog(plan);
  const mapping = resolve(root, 'planning/published.json');
  const published = existsSync(mapping) ? JSON.parse(readFileSync(mapping, 'utf8')) : {};
  if (process.argv.includes('--export')) {
    console.log(JSON.stringify(plan.issues.map((issue) => ({
      key: issue.key, title: `[${issue.key}] ${issue.title}`,
      body: issueBody(issue, plan, published),
      labels: [`priority:${issue.priority}`, `type:${issue.type}`, `area:${issue.area}`],
      milestone: published.milestones?.[issue.milestone]?.number,
    }))));
  } else if (process.argv.includes('--render')) {
    const rows = ['# Issue index', '',
      'Initial source: `backlog.json`. Links/numbers: `published.json`. Live GitHub issues hold execution status and reviewed changes.', '',
      'Start with G01 after F01; G02 is independent. Read [roadmap](../docs/ROADMAP.md) before taking later phases.', ''];
    for (const milestone of plan.milestones) {
      rows.push(`## ${milestone.title}`, '', milestone.description, '', '| Key | Issue | Dependencies | Priority |', '| --- | --- | --- | --- |');
      for (const issue of plan.issues.filter((item) => item.milestone === milestone.key)) {
        const remote = published.issues?.[issue.key];
        rows.push(`| ${issue.key} | ${remote ? `[#${remote.number} ${issue.title}](${remote.url})` : issue.title} | ${issue.depends_on.join(', ') || 'None'} | ${issue.priority} |`);
      }
      rows.push('');
    }
    writeFileSync(resolve(root, 'planning/ISSUES.md'), rows.join('\n'));
    console.log('Rendered planning/ISSUES.md');
  } else {
    console.log(`Valid backlog: ${plan.issues.length} issues, ${plan.milestones.length} milestones, no dependency cycles.`);
  }
}

# Planning source and live execution

- `backlog.json`: validated initial issue/milestone source with stable keys.
- `published.json`: actual GitHub numbers/URLs, generated after publishing.
- `ISSUES.md`: human-readable index, generated with `node scripts/planning.mjs --render`.

`node scripts/planning.mjs` checks unique keys, required acceptance/evidence and
acyclic dependencies. `--export` renders issue bodies and labels as JSON for a
maintainer or connector. It does not write to GitHub or expose credentials.

Once published, live GitHub issue discussions/acceptance and PRs hold execution
status. The initial seed is not a second task tracker. If scope changes, update
the relevant product/decision docs and live issue explicitly; refresh the seed
when changing the overall roadmap. Never infer completion from milestone order.

Publish metadata/issues only to the intended repository after inspecting existing
keys. Re-runs must reuse IDs rather than duplicate issues. Link dependencies to
their real issues. Avoid assignees unless a person actually accepted the task.
Do not notify/request reviewers without authorization.

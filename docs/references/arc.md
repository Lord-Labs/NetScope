# Arc source, reference and updates

Reviewed: 2026-10-22. User reference:
`npx shadcn@latest add https://uiarc.dev/r/arc-skill.json`.

The registry contains agent guidance and targets ~/.claude/skills globally. We
read it as reference without installing global instructions. Its catalog,
component props, design/composition/motion/responsive/accessibility/checklist
guidance informed the implementation. Product and security rules remain in AGENTS.

## Included free source

The following selected items were copied using Arc's documented manual install
method, with their original contents and relative imports:

| Registry | Local files |
| --- | --- |
| https://uiarc.dev/r/arc-foundation.json | apps/client/src/components/arc/foundation.css |
| https://uiarc.dev/r/button.json | apps/client/src/components/arc/button/button.tsx and button.module.css |
| https://uiarc.dev/r/arc-motion-tokens.json | apps/client/src/components/arc/motion-tokens.ts and lib/motion-tokens.ts |

Button is used for actual local UI actions. No Arc demo users, consumption,
images, logos or Pro source are included. The MIT copyright/license notice is
preserved in [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Integration and update policy

React DOM, CSS modules and Motion run in the browser and Tauri WebViews. Read
https://uiarc.dev/components/button/markdown before changing props. Prefer an
existing free item only when it fits the task; do not install the entire catalog.
From apps/client, components.json enables `npx shadcn@latest add @uiarc/<id>`.
Review the fetched source/dependencies and diff before updates, preserve notices,
then run TypeScript, component, browser, production-build and affected native checks.

Arc foundation is imported once, followed by generated NetScope semantic CSS.
NetScope uses neutral surfaces, one restrained accent, 400/500 type, Arabic/RTL,
English/LTR and truthful unknown/coverage states. A01 bundles licensed Inter
(Latin) and Noto Sans Arabic (Arabic) subsets with SIL OFL notices and no runtime
font download; see [third-party notices](../../THIRD_PARTY_NOTICES.md#fonts).
Do not override component internals to imitate a Pro component.

## Primary sources

- https://uiarc.dev/llms.txt
- https://uiarc.dev/docs/installation
- https://uiarc.dev/license
- https://uiarc.dev/r/arc-skill.json

UI/UX Pro Max contributed responsive/accessibility review guidance and React
testing-library semantic queries. The React best-practices review uses small
components, effect-based browser mutations, stable keys, explicit TS props,
named icon imports and no speculative memoization/state/data-fetch framework.

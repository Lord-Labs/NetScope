# NetScope design system

Status: accepted direction and foundation tokens; real-data screens follow A01/A06.
Reference: [Arc provenance and adaptation](references/arc.md).

## Direction

A calm, precise shared-internet utility: neutral canvas, readable numbers, one
restrained blue accent, generous but efficient spacing, and one useful action
per surface. The character comes from type/rhythm and honest interaction, not
ornament, glowing charts or a grid of decorative cards.

Arc's original registry is for React. NetScope uses original Flutter/Svelte
components and semantic tokens inspired by its principles. Do not run shadcn
against the Flutter app, add React to satisfy a reference, copy Pro source,
or vendor the external skill as an instruction that overrides AGENTS.

## Source of truth

`design/tokens.json` defines original light/dark colors, type/space/radius scales,
motion and layout. `npm run tokens:generate` writes:

- `design/tokens.css` for the later Svelte website;
- `apps/client/lib/design/tokens.g.dart` for Flutter.

`npm run tokens:check` detects drift. Raw values belong in the token source,
not individual screens. No build-time token framework or extra generator dependency.

## Visual rules

- Neutral backgrounds and surfaces. Accent is for selection, one primary action,
  focus and emphasized data. Status colors represent real status with text.
- Text weights 400 and 500. Hierarchy uses size/spacing/contrast. Changing values
  use tabular numerals and reserved space. No all-caps or eyebrow headings.
- System fonts in the foundation; A01 evaluates bundled licensed Latin/Arabic
  fonts (Inter/Geist-like Latin and an appropriate Arabic family). No runtime
  font download or paid font requirement. Arabic readability beats literal font matching.
- Thin dividers and borders before cards; shadows only on floating elements.
  No decorative gradients, glass blur, colored shadows, nested decorative cards
  or icons in unrelated rounded tiles.
- 4-point spacing grid. 16 inside groups, 24 between regions, 32-48 between
  sections. Page gutters 16 on compact and 24-32 on wider screens.
- Radius tokens are adapted to 16/24/28. Inner corners account for padding;
  do not repeat the outer radius on nested children.
- One consistent outline icon style. Foundation uses Material outlined icons;
  changing family later requires accessibility/license/size review, not mixing.

## Screen contract

Primary navigation stays at two destinations: overview and devices. Account
and advanced controls are secondary. Group/settlement screens arrive only with
their feature milestones. Setup is a guided flow with permission purpose and
a direct remediation action, not a technical settings dashboard.

| Region | Job | Required states |
| --- | --- | --- |
| Usage summary | Read this period's actual/estimated use | Unknown, measured zero, real value, partial scope |
| Collector status | Know whether/how collection is working | Not started, collecting, paused, permission, error, unsupported |
| Freshness | Understand the age of data | Last observation separate from last sync; offline |
| History | Inspect intervals and gaps | Loading, empty, error, measured, gap, long range |
| Setup | Select household network and grant necessary access | Current context, denied permission, retry, success |
| Settlement (later) | Review selected costs/period and evidence | Draft, provisional, approved, correction |

Unknown quantities display a dash and explanation, never a seeded zero.
Financial cards do not appear in the local alpha. The foundation explicitly
says it is not measuring; real data is wired by later issues.

## Accessibility and responsive behavior

- Arabic RTL and English LTR at every supported screen. Use directional
  padding/alignment, correct time/number formatting and sensible focus order.
- Test 320/390/768/1024/1440 widths, landscape and 200% text. No page overflow;
  tables scroll in their region or become lists. Main action stays findable.
- Android touch targets >=48 logical pixels; keyboard navigation and clear
  visible focus on Windows/web; screen-reader names on icon controls.
- Body/secondary text contrast >=4.5:1 in both themes; meaningful control
  boundaries/icons >=3:1. Token tests are necessary but not a screen-reader test.
- State includes a label and explanation, never color alone. Preserve inputs
  on failure. Confirm saves beside the action; toast is not sole confirmation.

## Motion

Fast 160 ms, standard 240 ms, exit 180 ms. Motion communicates a change with one
continuous gesture; no bounce on meter values/status, no repeated entrances,
no chart animations implying measurements that never happened. Respect reduced
motion by showing final states immediately. Avoid layout shift and flashing.

## PR evidence

Attach real renders for both languages/themes and compact/desktop sizes, plus
error/unknown/permission states affected by the change. Include keyboard and
text-scale results. Record what was not checked. CI widget tests do not replace
TalkBack/Narrator testing or native permission-flow tests.

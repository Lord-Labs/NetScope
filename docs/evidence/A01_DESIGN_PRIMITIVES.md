# A01 design primitives and state gallery evidence

Date: 2026-10-22. Issue: [#4 A01](https://github.com/Lord-Labs/NetScope/issues/4).
Branch: `feat/a01-design-primitives`. This is UI/scaffold evidence, not network
measurement, collector accuracy or app-release validation.

## Scope checked

- Semantic usage, collector, freshness, history, setup and in-place feedback
  primitives, plus a labeled state gallery reachable from the footer.
- Unknown, measured zero, measured value, estimated value and partial coverage
  are separate states. Unknown renders as a dash, never a zero.
- Arabic RTL and English LTR, light/dark, keyboard operation, reduced motion,
  visible focus, preference persistence and 48 CSS-pixel minimum button height.
- Bundled Inter (latin) and Noto Sans Arabic (arabic) weights 400/500, with
  SIL OFL 1.1 notices, no runtime font download and no ornamental family.
- The overview still reports no measurements and the gallery states its example
  values are not household data.

## Environment and commands

Windows desktop, Node 24.19.0, npm 11.17.0, Playwright 1.64.1, Chromium
156.0.8078.4. No physical Android or WebView2 device was used for this evidence.

| Command | Outcome |
| --- | --- |
| `npm run check:repo` | passed; 58 local Markdown links verified |
| `npm run tokens:check` | passed; design tokens match |
| `npm run typecheck` | passed for client and API |
| `npm run lint` | passed for client |
| `npm test` | passed: 5 repository/contract, 2 API and 8 client tests |
| `npm run build` | passed: Vite client build and Worker dry-run |
| `npm run test:e2e --workspace @netscope/client` | 10 Chromium tests passed |

The Chromium suite covers gallery keyboard entry and focus return, computed
theme, reduced motion at `0.01ms`, preference reload, and 320/390/768/1024/1440
widths with 200% root text in both languages. It asserts no document-level
horizontal overflow and every button at least 48 px tall.

## Renders

Twenty full-page renders were produced locally (gitignored; not attached to this
file) under `.local/previews/a01/`:

`gallery-{320,390,768,1024,1440}-{ar,en}-{light,dark}-text200.png`

They show the gallery in both themes and languages at every required width with
200% text. The 320 px and 1440 px extremes were inspected for clipping,
directionality, card wrapping, status labels and value tags; the automated
matrix checks the remaining widths. They are local review artifacts, not
committed screenshots.

## Font review

| File | Family | Weight | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| `inter-latin-400.woff2` | Inter | 400 | 23664 | `8909904ab6c872eb994093482a88a28eca2cd95912d7b6fecd72103b0dc07edc` |
| `inter-latin-500.woff2` | Inter | 500 | 24272 | `f3779f1efccc4bdcdf9c0a02ab95bf6bd092ed09c48c08cedc725889edd1d19f` |
| `noto-sans-arabic-arabic-400.woff2` | Noto Sans Arabic | 400 | 48840 | `4e2ca0745c908761dc5c5db951662873887c59366fa1a5693ad22c0864abf1bd` |
| `noto-sans-arabic-arabic-500.woff2` | Noto Sans Arabic | 500 | 53120 | `38599e3046a0ceeae9d10fb9c282424d16b7a05f0838478fabe27908fc922722` |

Total 146.4 KiB. Both families are SIL OFL 1.1; provenance, upstream versions
and the full license texts are in [third-party notices](../../THIRD_PARTY_NOTICES.md#fonts).
The fonts load from the app bundle through `apps/client/src/fonts.css`, with
system fonts only as fallback. No font CDN, paid font or display-only family was
added.

## Limits

- No WebView2 or Android WebView screen-reader pass (Narrator/TalkBack) was run.
- No Android hardware touch-target, font-rendering or permission-UI review was run.
- Chromium layout does not prove native WebView text scaling or focus behavior.
- The gallery contains clearly labeled example values; it is not collector data,
  a measurement claim or a financial statement.
- The overview and devices views remain foundation placeholders. G01 is still the
  next measurement step; A06 wires real collector data into these primitives.

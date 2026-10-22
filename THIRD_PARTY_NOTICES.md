# Third-party notices

Dependencies retain their package licenses. Vendored Arc free registry source
in `apps/client/src/components/arc` was retrieved on 2026-10-22: foundation.css,
button/*, motion-tokens.ts and lib/motion-tokens.ts. See
[provenance](docs/references/arc.md) and https://uiarc.dev/license (Free: MIT).
No Arc Pro source or sample preview content is included.

## Arc

MIT License

Copyright (c) 2026 Elia Kuratli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Fonts

Bundled UI typefaces (A01 design primitives), vendored under
`apps/client/src/fonts/` and loaded by `apps/client/src/fonts.css`. Only normal
style, weights 400 and 500, and the `latin`/`arabic` subsets are included, so the
app makes no runtime request to a font CDN and no paid or ornamental font is
required. The binaries are unmodified files from the Fontsource CDN (npm package
version 5.3.0), which packages the Google Fonts static builds of these SIL Open
Font License 1.1 families. Retrieved 2026-10-22.

| File | Family | Subset | Weight | Bytes | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| `inter-latin-400.woff2` | Inter | latin | 400 | 23664 | `8909904ab6c872eb994093482a88a28eca2cd95912d7b6fecd72103b0dc07edc` |
| `inter-latin-500.woff2` | Inter | latin | 500 | 24272 | `f3779f1efccc4bdcdf9c0a02ab95bf6bd092ed09c48c08cedc725889edd1d19f` |
| `noto-sans-arabic-arabic-400.woff2` | Noto Sans Arabic | arabic | 400 | 48840 | `4e2ca0745c908761dc5c5db951662873887c59366fa1a5693ad22c0864abf1bd` |
| `noto-sans-arabic-arabic-500.woff2` | Noto Sans Arabic | arabic | 500 | 53120 | `38599e3046a0ceeae9d10fb9c282424d16b7a05f0838478fabe27908fc922722` |

Total: 149,896 bytes (146.4 KiB). Upstream versions from the Fontsource
metadata: Inter `v20` (Google Fonts last modified 2025-09-10) and Noto Sans
Arabic `v33` (last modified 2025-09-17).

Fetch provenance (retrieved 2026-10-22):

- https://cdn.jsdelivr.net/fontsource/fonts/inter@5.3.0/latin-400-normal.woff2
- https://cdn.jsdelivr.net/fontsource/fonts/inter@5.3.0/latin-500-normal.woff2
- https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-arabic@5.3.0/arabic-400-normal.woff2
- https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-arabic@5.3.0/arabic-500-normal.woff2
- Package metadata: https://cdn.jsdelivr.net/npm/@fontsource/inter@5.3.0/metadata.json
  and https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-arabic@5.3.0/metadata.json
- License texts: https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt
  and https://raw.githubusercontent.com/google/fonts/main/ofl/notosansarabic/OFL.txt
- Fontsource packaging project: https://github.com/fontsource/font-files

Alternatives reviewed but not bundled: IBM Plex Sans Arabic (SIL OFL 1.1,
`arabic` subset, 400/500) is a valid alternative, but its more distinctive
humanist voice and payload difference (under 20 KiB) did not outweigh Noto Sans
Arabic's neutral, unmodulated Arabic-script UI design and Arabic readability.
Paid/commercial fonts, ornament or display-only families, and runtime font CDNs
were rejected: the UI must stay open-licensed, bundled and calm.

### Inter

Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter)

Licensed under the SIL Open Font License, Version 1.1, reproduced below.

### Noto Sans Arabic

Copyright 2022 The Noto Project Authors (https://github.com/notofonts/arabic)

Licensed under the SIL Open Font License, Version 1.1, reproduced below.

### SIL Open Font License 1.1 (applies to both families above)

SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.

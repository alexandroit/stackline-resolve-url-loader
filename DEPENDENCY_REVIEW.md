# Production Dependency Review

Review date: 2026-08-30
Review expires: 2026-11-30

Every runtime edge is exact and the complete lockfile closure is checked by
`npm run check:licenses`. A review can approve a stable package; it cannot
override an archived or disabled source repository, an npm deprecation, a
known advisory, an invalid dependency tree, or a failed clean installation.

| Installed component | Role | Source status on review date |
| --- | --- | --- |
| `@stackline/loader-utils@1.0.2` | Maintained compatibility replacement for archived `loader-utils` | Stackline source active; CI and CodeQL required |
| `emojis-list@3.0.0` | Loader interpolation data | Current release; source active; zero dependencies |
| `json5@2.2.3` | Loader option parsing | Current release; source active; zero dependencies |
| `postcss@8.5.26` | CSS parser and transformer | Current release; source active |
| `nanoid@3.3.18` | PostCSS transitive runtime | Maintained source; Node 12-compatible line |
| `picocolors@1.1.1` | PostCSS transitive runtime | Current release; source not archived |
| `source-map-js@1.2.1` | PostCSS transitive source maps | Current release; source active; zero dependencies |
| `regex-parser@2.3.1` | Loader regular-expression parser | Current release; source not archived; zero dependencies |
| `source-map@0.6.1` | Required synchronous source-map consumer | Upstream source active; pinned compatibility line; zero dependencies |

Primary evidence:

- https://registry.npmjs.org/@stackline%2floader-utils
- https://registry.npmjs.org/emojis-list
- https://registry.npmjs.org/json5
- https://registry.npmjs.org/postcss
- https://registry.npmjs.org/nanoid
- https://registry.npmjs.org/picocolors
- https://registry.npmjs.org/source-map-js
- https://registry.npmjs.org/regex-parser
- https://registry.npmjs.org/source-map
- https://github.com/alexandroit/stackline-loader-utils
- https://github.com/postcss/postcss
- https://github.com/mozilla/source-map

Before 2026-11-30, or earlier if npm/GitHub metadata changes, repeat the full
review from registry and source data. Any newly abandoned runtime edge must be
removed, replaced, or maintained leaf-first before this package is released.

# Dependency maintenance for @stackline/resolve-url-loader 1.0.4

Reviewed 2026-09-28. Direct dependency aliases retain the original import names and pin the verified Stackline maintenance releases. The public API and declared runtime compatibility remain unchanged.

| Import / install key | Previous requirement | Maintained requirement | Verified release |
| --- | --- | --- | --- |
| `regex-parser` | `2.3.1` | `npm:@stackline/regex-parser@1.0.0` | [@stackline/regex-parser](https://github.com/alexandroit/stackline-regex-parser/releases/tag/stackline-v1.0.0) |
| `source-map` | `npm:source-map-js@1.2.1` | `npm:@stackline/source-map-js@1.0.0` | [@stackline/source-map-js](https://github.com/alexandroit/stackline-source-map-js/releases/tag/stackline-v1.0.0) |
| `loader-utils` | `npm:@stackline/loader-utils@1.0.2` | `npm:@stackline/loader-utils@1.0.4` | [@stackline/loader-utils](https://github.com/alexandroit/stackline-loader-utils/releases/tag/stackline-v1.0.4) |

Each linked release was published through GitHub Actions and checked against its exact CI tarball, npm provenance and signatures, direct/aliased installations, and immutable release assets before adoption. Original upstream attribution and license texts remain in the dependency packages. Test-only upstream comparison packages remain independent oracles. Only the original parent projects’ direct/runtime/dev dependencies are in this audit scope; transitive dependencies are not recursively forked.

The development-only `fast-uri` lock entry is updated from 3.1.6 to 3.1.8, within its existing compatible requirement, to address [GHSA-qw65-cvwx-89v3](https://github.com/advisories/GHSA-qw65-cvwx-89v3) and [GHSA-58mr-gqgx-xq4g](https://github.com/advisories/GHSA-58mr-gqgx-xq4g). The production dependency closure is unaffected by this security update.

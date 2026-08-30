# Verification

The release gate covers upstream helper behavior, differential
`resolve-url-loader@5.0.0` output, object and string source maps, custom joins,
query/hash/root handling, malformed maps and configuration, iterator bounds,
the issue-239 Windows drive correction, explicit POSIX non-regression, ESM,
TypeScript 3.9 and current, Node.js 12 through current, packed scoped and npm
alias consumers, and real webpack 4/5 builds with current Dart Sass.

Webpack 4 is installed only inside a disposable exact-version consumer. This
retains the historical build proof without putting its abandoned advisory
graph in the committed lockfile. The main full audit and production-only audit
must both be clean.

Package checks also cover all shipped deep entries, file mode 0644, publint,
Are the Types Wrong, dependency signatures, exact vendored-source integrity,
the complete production license inventory, hashes, and CycloneDX output.
Publication and registry evidence is appended only after the exact immutable
artifact is independently verified; no such publication is claimed here.

## 2026-08-28 local gate

- `npm run verify`: **PASS**. The primary TAP runs completed 26 tests: 25
  passed and the real-Windows-only PostCSS integration was skipped on Linux.
  Its platform-injected unit regression passed; Windows CI runs the integration
  without the skip. The isolated webpack 4 build, ESM facade, two TypeScript
  builds, and eight runtime executions also passed outside that TAP count.
- Coverage: 94.01% statements/lines, 90.23% branches, and 92.85% functions
  across the maintained loader sources. The coverage run completed 25 tests:
  24 passed and the same Windows-only integration was skipped.
- Real webpack 5 and disposable webpack 4 builds passed with
  `sass@1.103.1`. Sass reports the expected legacy-JS-API deprecation for the
  historical `sass-loader@10.5.2` fixture; it is not a build failure.
- Runtime checks passed Node.js 12.22.12, 14.21.3, 16.20.2, 18.20.8,
  20.20.0, 22.22.0, 24.13.0, and the host 20.20.2. TypeScript 3.9.10 and
  7.0.2 both passed.
- Packed scoped, historical-key file alias, ESM, CommonJS, extensionless and
  `.js` deep entries, vendored process entry, and production-tree consumers
  passed. The dry-run artifact contains 76 files, all normalized to mode 0644.
- Publint reported no problems; its two suggestions (a `sideEffects` marker
  and an `exports` map) are intentionally not applied because this package
  prioritizes historical loader/deep-entry behavior. Are the Types Wrong
  reported every evaluated resolution profile green.
- Production and complete committed-graph audits both reported zero findings.
  All 257 audited registry packages had verified signatures; 44 had verified
  attestations. The eleven-component production/vendored license inventory and
  vendored source digest passed.

## 2026-08-28 remote Windows harness correction

The first GitHub branch and tag workflows passed Linux quality, coverage,
packaging, all Node 12-24 production jobs, real Windows issue-239 behavior,
CodeQL, and the Windows webpack 5 build. The disposable webpack 4 harness then
stopped before installation because Node cannot execute `npm.cmd` directly
through `execFileSync` on Windows (`spawnSync npm.cmd EINVAL`). This was a CI
harness invocation defect, not a package, registry artifact, or webpack result.

The repository-only harness now requests Node's shell path only for the Windows
batch-file invocation. The published tarball is unchanged: release scripts and
tests are not shipped package files, and the immutable registry/GitHub bytes
remain authoritative. Corrected main CI run `33173045990` passed all 12 jobs,
including both Windows webpack 4 and 5 builds, the four-test real-Windows
issue-239 suite, all Node 12-24 jobs, and packed-artifact validation. Corrected
CodeQL run `33173045972` also passed.

## 2026-08-28 release verification

- Accepted artifact SHA-256:
  `3037fbe003806509e97dc8c472ada32411acf269b4bb6b4c602627dde46c613a`.
  Verdaccio, official npm, and the immutable GitHub release are byte-identical.
- Official npm records `@stackline/resolve-url-loader@1.0.0` at
  `2026-08-28T12:39:34.733Z`; `latest` is 1.0.0. Direct scoped and exact npm
  alias installs plus callable/deep-entry smokes pass against both registries.
- The GitHub release contains ten checksummed inventory, license, SBOM, notes,
  checksum and tarball assets and reports `immutable: true`.
- The initial remote source workflows passed Linux quality/package jobs, all
  eight Node runtime jobs, real Windows issue-239 behavior, Windows webpack 5,
  and CodeQL. Their overall CI conclusion records the repository-only Windows
  webpack 4 `npm.cmd` invocation failure described above; the correction is on
  main commit `631f49d11e31b22f2d0b15314719e32640a7540d`. Corrected CI run
  `33173045990` passed all 12 jobs, including Windows webpack 4/5, and corrected
  CodeQL run `33173045972` passed.
- Documentation commit `9bce44d17ce94efae9537adc9c53f06e5a112297`, CI
  run `33172839845`, and CodeQL run `33172839656`: PASS. Exact production
  manifests, all 18 routes, examples, robots, sitemaps and dependency version
  text pass origin, public and forced-edge checks.
- Downstream PR https://github.com/zaproxy/browser-extension/pull/376 passes
  DCO and Checkmarx in addition to local target gates. The different-repository
  maintainer-decision issue is
  https://github.com/gravity-ui/app-builder/issues/352.

## 2026-08-30 recursive dependency release candidate

- Replaced the archived production `loader-utils@2.0.4` edge with the exact
  `loader-utils@npm:@stackline/loader-utils@1.0.2` alias. The maintained leaf
  was first validated against the complete upstream `2.0.4` contract and this
  package's real Webpack 4/5 builds, then published as a byte-identical
  Verdaccio/npm artifact.
- A clean official-registry install added 259 development and production
  packages without warnings and both the complete and production-only npm
  audits reported zero vulnerabilities. The lockfile contains no Verdaccio or
  localhost URL.
- The production tree contains nine installed dependencies: the maintained
  loader fork, `emojis-list`, `json5`, PostCSS and its three runtime children,
  `regex-parser`, and the synchronous `source-map` compatibility line. The
  exact license inventory plus the vendored processor covers all ten runtime
  components.
- `npm run verify`: **PASS**. Contract tests, the previously failing non-file
  URL regression, real Webpack 5, disposable Webpack 4, TypeScript 3.9/current,
  Node.js 12 through 24, packed scoped/alias/deep imports, 94.01% line coverage,
  package validation, source/vendor integrity, registry signatures, and all
  audit gates passed.

## 2026-08-30 version 1.0.2 release verification

- Replaced direct `source-map@0.6.1` with the maintained
  `source-map@npm:source-map-js@1.2.1` compatibility alias. The resulting
  branch has zero transitive dependencies and retains the synchronous API used
  by this loader.
- A clean `npm ci --ignore-scripts` installed 262 packages without warnings.
  Production and complete audits reported zero vulnerabilities; all 262
  packages had verified registry signatures and 44 had attestations.
- `npm run verify`: **PASS**. Differential behavior, malformed/stress cases,
  real Webpack 4/5 builds, Node.js 12-24, TypeScript 3.9/current, scoped and
  historical alias installs, deep imports, licenses, package metadata, SBOM,
  and vendored-source integrity all passed. Coverage remained 94.01% lines,
  90.23% branches, and 92.85% functions.
- Main CI `33303452757`, tag CI `33303569442`, and CodeQL `33303452722`:
  **PASS**. The Windows job independently passed both Webpack generations and
  current Dart Sass.
- Accepted artifact: 75 files, 47,576 packed bytes, 176,636 unpacked bytes;
  SHA-1 `299b4db419a7643bc76425d1bc0cc5e9e992b084`, SHA-256
  `c7012892dbc9e1284b37d5dfe45dec8bf3312a239056d70a59cb57da76519e74`,
  and integrity
  `sha512-mtj9cN0FazltRCbiAIA9WRXK/JjbH/5r+Tatmb1215kLDeEexdBDhCnh0RL9OkxnDs7mJcy8vY91rMj3Odasew==`.
- Verdaccio and official npm registry consumers passed direct scoped, exact
  npm-alias, CommonJS, ESM, and deep-entry smokes with valid production trees.
  Downloaded tarballs from both registries were byte-identical to the accepted
  artifact. Official npm records `1.0.2` at `2026-08-30T09:15:50.247Z` and
  exposes it as `latest`.
- GitHub release ID `379232845` reports `immutable: true` and contains all ten
  checksummed artifact, inventory, license, SBOM, notes, and checksum assets:
  https://github.com/alexandroit/stackline-resolve-url-loader/releases/tag/stackline-v1.0.2.

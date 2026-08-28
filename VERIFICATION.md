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

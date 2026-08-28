# Dated GO decision: `resolve-url-loader`

Observation date: 2026-08-28  
Decision timestamp: 2026-08-28T12:08:26Z  
Queue selection: rank 1, `CODEX_READY`, no user pin  
Decision: **GO**

## Required decision output

- `problem`: The package still solves a documented webpack/Sass correctness
  gap: Sass does not rewrite asset URLs relative to the partial that declared
  them. Current `sass-loader` documentation still names `resolve-url-loader` as
  one of the two solutions. The sole npm writer has published no v5 release
  since 2022, dependency maintenance PR 227 remains open, and the current v5
  line has an unreconciled Windows drive-path failure in issue 239.
- `active_users`: Active direct declarations and source-level use were
  confirmed in `TerriaJS/terriajs` (two current manifests and two webpack
  configurations; pushed 2026-08-27), `Open-MBEE/exec-ve` (manifest and
  webpack config; pushed 2025-11-25), and current direct manifests in
  `h5p/h5p-branching-scenario` (pushed 2026-08-28) and `ploi/ploi-core`
  (pushed 2026-07-26). This is direct-use evidence, not a lockfile-only or
  dependency-graph inference.
- `successor_landscape`: Current npm search found no maintained, general
  drop-in. The named fork packages are old webpack-era fixes or wrappers.
  Next.js vendors an attributed, framework-specific implementation rather than
  offering a reusable npm continuation. The canonical webpack `sass-loader`
  project still recommends the historical package for the exact URL-rebasing
  problem, so the functionality has not been superseded by webpack itself.
- `compatibility_contract`: Preserve the callable CommonJS webpack loader;
  the `asGenerator`, `createJoinImplementation`, `createJoinFunction`,
  `defaultJoinGenerator`, and `defaultJoin` properties; all packed `lib/*`
  deep entries; webpack 4 and 5 source-map output formats; object and JSON
  string input maps; custom join arity and fallback behavior; query/hash
  retention; root-relative opt-in; POSIX and Windows paths; source-map error
  and warning categories; Node 12 or newer; and historical-key npm alias
  installation. There is no browser-runtime API to invent.
- `risk`: Source-map decoding and path normalization are both platform and
  filesystem sensitive. A seemingly harmless dependency or file-URL change
  can alter emitted CSS, loader errors, or final source-map sources. Custom join
  iterators also require bounded stress tests.
- `maintenance_cost`: **High**. The maintained package needs real webpack 4/5
  builds, current Dart Sass and representative historical Sass pipelines,
  Windows and POSIX CI, malformed source-map tests, packed deep-entry tests,
  and current dependency/license review.
- `adoption_targets`: Initial qualified research pool:
  `TerriaJS/terriajs`, `h5p/h5p-branching-scenario`, `Open-MBEE/exec-ve`, and
  `outl1ne/nova-menu-builder`. Every contact still requires current manifest,
  actual source use, contribution/security policy, compatibility, tests, and
  live duplicate-contact checks.
- `proof_of_success`: Upstream and differential parity, a Windows regression
  for issue 239, green webpack 4/5 builds with current Dart Sass, Node 12-24
  and Windows CI, TypeScript 3.9/current declarations, clean production audit,
  exact packed consumers (scoped and legacy alias), byte-identical Verdaccio
  and official npm artifacts, and one independently tested downstream change.

## Current immutable inputs

- Official npm version: `resolve-url-loader@5.0.0`, published
  2022-01-17T21:55:09.985Z; sole npm writer `bholloway`; not deprecated.
- Latest complete UTC week: **9,292,298** downloads for
  2026-08-21 through 2026-08-27, observed 2026-08-28T12:05:00Z at the official
  downloads endpoint. This dated observation supersedes the earlier queue
  snapshot without rewriting its history.
- Exact official tarball SHA-256:
  `305118c7e585071ebc610018b08b69d01071857ca5abd7e07a41df823ccecb19`;
  npm integrity:
  `sha512-uZtduh8/8srhBoMx//5bwqjQ+rfYOUq8zC9NrMUGtjBiGTtFJM42s58/36+hTqeqINcnYe08Nj3LkK9lW4N8Xg==`.
- Canonical source/tag commit:
  `e2695cde68f325f617825e168173df92236efb93`; repository is non-archived,
  MIT source is included in the artifact, and the last repository push was
  2022-12-02.
- A fresh install resolves patched `loader-utils@2.0.4`, current
  `postcss@8.5.26`, and reports zero production audit findings. No vulnerability
  is claimed for a normal current v5 install, and the GitHub repository-level
  advisory list was empty.

## Issues, patches, and acceptance criteria

- Issue 239 is an active Windows drive/file-URL correctness lead. Acceptance:
  reproduce its `/D:/...` source-map form without a Windows false-directory
  failure while preserving normal POSIX and Windows absolute paths.
- PR 227 attempted a broad dependency update but its old Node Sass fixtures
  failed. It is not accepted wholesale. Each dependency change must pass a
  reconstructed matrix with pinned historical fixtures and current Dart Sass.
- PR 228 merely raised the `loader-utils` minimum; upstream rejected it because
  `^2.0.0` already selects a patched release. Stackline will not claim the
  current install is vulnerable, but a patched minimum is acceptable if the
  packed dependency graph and webpack 4 behavior remain green.
- Issue 238 concerns the v4/PostCSS 7 line, not the v5 artifact selected here.
  It must not be presented as a current v5 vulnerability.
- Issue 119 (`image-set()`) and issue 196 (standalone PostCSS/Vite) are feature
  requests, not compatibility defects. They do not enter the 1.0.0 contract
  unless their semantics and regressions are fully characterized.

## Gate result

Legal/provenance, current-problem, forward-necessity, differentiation,
compatibility-feasibility, adoption-path, and evidence-path gates pass.
Maintenance burden is high but proportionate to verified reach and the lack of
a maintained reusable drop-in. Implementation may begin; any unexplained CSS
or source-map differential, Windows regression, runtime/type/package/audit
failure, incomplete license inventory, or packed-consumer failure is a red
publication gate.

## Primary sources

- https://registry.npmjs.org/resolve-url-loader
- https://api.npmjs.org/downloads/point/2026-08-21:2026-08-27/resolve-url-loader
- https://github.com/bholloway/resolve-url-loader/tree/e2695cde68f325f617825e168173df92236efb93
- https://github.com/bholloway/resolve-url-loader/issues/239
- https://github.com/bholloway/resolve-url-loader/pull/227
- https://github.com/bholloway/resolve-url-loader/pull/228
- https://github.com/webpack/sass-loader#problems-with-url
- https://github.com/vercel/next.js/tree/canary/packages/next/src/build/webpack/loaders/resolve-url-loader
- https://github.com/TerriaJS/terriajs
- https://github.com/h5p/h5p-branching-scenario
- https://github.com/Open-MBEE/exec-ve

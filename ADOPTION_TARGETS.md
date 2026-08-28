# Adoption targets

Observation date: 2026-08-28.

Public contact always requires a fresh live GitHub deduplication search. Do not
send an unsolicited follow-up; respond only to a concrete maintainer question
with evidence.

## Pull request opened

- https://github.com/zaproxy/browser-extension/pull/376 —
  `zaproxy/browser-extension`: active Node 24/Yarn/Webpack 5 extension build;
  directly declares `resolve-url-loader` and resolves it in the Sass chain at
  `webpack.config.js:127`. The two-file exact npm alias retains the historical
  key and unchanged configuration. Frozen installation, package/deep-entry
  smoke, lint, 27 unit tests, and all six production bundles pass; output
  hashes match baseline. DCO and Checkmarx pass. The PR discloses replacement
  maintainership and makes no vulnerability claim.

## Different-repository issue opened

- https://github.com/gravity-ui/app-builder/issues/352 —
  `gravity-ui/app-builder`: active Node 24/pnpm published package; directly
  ships `resolve-url-loader` at runtime and resolves it in
  `createSassStylesRule`. Its Yandex CLA and behaviorally sensitive loader
  ordering make an issue appropriate before a patch. The issue asks maintainers
  to choose the exact alias, intentional retention, or removal/replacement of
  URL rebasing. It identifies exact manifest/source lines, offers the complete
  target gate, discloses maintainership, and explicitly makes no security
  claim.

The pull request targets `zaproxy/browser-extension`, so the issue repository
is different and the minimum one-PR/one-issue adoption coverage is complete.
Canonical operation records are Drive files
`1q76Ht_gN5vDDpbe7ZNKj6-I_qubcYtkG` (PR) and
`1SuKSs2cASflP-T777L8ygr-7W4Jsz4v5` (issue).

## Evaluated but not contacted

- `TerriaJS/terriajs`: direct use, but an open competing removal proposal made
  a Stackline contact ineligible.
- `electron/fiddle`: repository policy enforces a seven-day npm minimum-age
  gate, incompatible with a same-cycle release.
- `h5p/h5p-branching-scenario`: direct declaration but weaker executable test
  evidence than the selected PR target.
- `Open-MBEE/exec-ve` and `outl1ne/nova-menu-builder`: lower-confidence current
  validation surface than the selected targets.

# Project memory

## Frozen compatibility inputs

- Compatibility baseline: `@stackline/resolve-url-loader@1.0.0`.
- Current release candidate: `@stackline/resolve-url-loader@1.0.2`.
- Resolve URL baseline: `resolve-url-loader@5.0.0`, source commit
  `e2695cde68f325f617825e168173df92236efb93`.
- Vendored source-map baseline: `adjust-sourcemap-loader@4.0.0`, commit
  `5f173eef`; the current upstream process/codec source was confirmed identical.
- Dated authorization inputs `decision.json` and `UPSTREAM_AUDIT.md` must remain
  unchanged.

## Compatibility decisions

- Keep a callable CommonJS root plus exactly five enumerable helper properties,
  in upstream order. Static duplicate assignments exist only so Node can expose
  those same helpers to ESM import syntax.
- Do not add a restrictive `exports` map. Historical extensionless and `.js`
  deep imports must keep resolving. `index.mjs` is the explicit facade and the
  CommonJS root also supports Node's default/named ESM bridge.
- Preserve the synchronous `source-map` consumer through
  `source-map@npm:source-map-js@1.2.1`. Pin the Node-12-compatible production
  graph exactly.
- Replace the archived `loader-utils` runtime with the exact
  `loader-utils@npm:@stackline/loader-utils@1.0.2` alias. Review every runtime
  dependency recursively and stop at maintained zero-dependency leaves.
- Vendor adjust v4 process and codecs, license, and package metadata. Run
  `npm run check:vendor` after any intentional vendor review; never update its
  expected digest casually.

## Windows issue 239

`file:///D:/x` is ambiguous across operating systems. Only a Windows runtime
may remove its leading slash; POSIX must preserve `/D:/x`. `remove` reads an
optional test platform from `arguments` so its historical arity stays one.
Keep both the injected Windows/POSIX unit cases and the real-Windows PostCSS CI
case.

## Test graph

Webpack 4 must remain outside the committed dependency graph. The isolated
script packs this package, installs exact webpack 4/Sass tooling in a temporary
consumer, builds, and deletes it. This keeps full and production audits clean
without weakening real compatibility coverage.

The 2026-08-28 local gate passed. No registry publication, repository creation,
remote automation change, adoption work, or release handoff was performed.

## 2026-08-30 — recursive dependency remediation

- The target's archived `loader-utils@2.0.4` dependency was traced before any
  target release. Verdaccio-only `@stackline/loader-utils@1.0.0` and `1.0.1`
  preflights were rejected by real Webpack compatibility tests and must never
  be promoted. `1.0.2` preserves the complete `2.0.4` contract.
- The maintained loader fork depends only on `emojis-list@3.0.0` and
  `json5@2.2.3`; both are current zero-dependency leaves with non-archived
  source repositories. The full target closure is pinned, license-inventoried,
  and must install without warnings or npm audit findings.
- `ADOPTION_TARGETS.md` contains an independent automation policy change and
  must remain outside this remediation commit.

## 2026-08-28 — post-release Windows CI correction

The immutable artifact and all shipped runtime files remain unchanged. The
first remote Windows webpack job passed webpack 5 and then failed before the
disposable webpack 4 install with `spawnSync npm.cmd EINVAL`. Node requires a
shell when launching a Windows `.cmd` batch file; the repository-only isolated
harness now selects that shell path on Windows and retains direct execution on
Unix. Corrected main CI run `33173045990` passed all 12 jobs, including Windows
webpack 4/5 and the real-Windows issue-239 suite; corrected CodeQL run
`33173045972` also passed. Preserve the original tag-run failure in the release
record without changing the immutable tag or artifact.

## 2026-08-28 — PUBLISHED

- Transitioned `CODEX_READY -> RESEARCHING -> BUILDING -> PUBLISHED` from queue
  rank 1 without a user pin. This continuous-program project is distinct from
  the completed fixed thlorenz roster.
- The accepted 76-file artifact was built once at 12:38:41Z from tagged commit
  `5595617fc84396ab3874b06aab9a2e9546b86bdd`; SHA-256
  `3037fbe003806509e97dc8c472ada32411acf269b4bb6b4c602627dde46c613a`.
  Verdaccio, official npm, and the immutable GitHub release serve identical
  bytes. Direct scoped and exact historical-key alias consumers pass.
- Official npm records the one-time `alex360qc` publication at
  `2026-08-28T12:39:34.733Z`. Public source, release and documentation are:
  https://github.com/alexandroit/stackline-resolve-url-loader,
  https://github.com/alexandroit/stackline-resolve-url-loader/releases/tag/stackline-v1.0.0,
  and https://alexandro.net/docs/vanilla/resolve-url-loader/.
- Documentation source commit
  `9bce44d17ce94efae9537adc9c53f06e5a112297` passed CI and CodeQL. Production
  contains exact 34-file catalog and 38-file package manifests, and the docs
  aggregate sitemap contains all 18 package routes. Nginx, origin, public and
  forced Cloudflare-edge checks pass. Recoverable backups are recorded in the
  documentation project memory.

## 2026-08-28 — adoption minimum covered

- Opened the focused two-file migration PR
  https://github.com/zaproxy/browser-extension/pull/376 after fresh zero-result
  contact/competition searches. Frozen install, exact package/deep-entry smoke,
  lint, 27 unit tests, six production bundles, DCO and Checkmarx pass. The PR
  discloses replacement maintainership.
- Opened the maintainer-decision issue
  https://github.com/gravity-ui/app-builder/issues/352 in a different
  repository after its own fresh deduplication and policy check. It offers
  alias, intentional-retention, and remove/replace choices, discloses
  maintainership, and makes no vulnerability claim.
- Different-repository check: `PASS`; remaining adoption debt:
  `COVERAGE_COMPLETE`. Do not follow up unsolicited.
- Canonical Drive records preserve the dated decision
  (`1ygGFNUta-_wpjS1Tk2cDXMr4LE6WpJSo`), project memory
  (`1xZhGaOY77BdfmOAnxIwsx5opMZVa1TjG`), release verification
  (`1k8rM1TMsdUGWBwrdwBN4Tu9K5rsDoZQM`), and adoption targets
  (`11jjcQdgXQuzuWekniqwKv02mova-oZxd`) under the active-projects folder.

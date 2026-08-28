# Project memory

## Frozen compatibility inputs

- Package: `@stackline/resolve-url-loader@1.0.0`.
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
- Keep `source-map@0.6.1` because its synchronous consumer is part of the loader
  algorithm. Pin the Node-12-compatible production graph exactly.
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

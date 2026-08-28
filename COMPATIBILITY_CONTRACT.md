# Compatibility contract

## Baseline

The behavioral baseline is the immutable `resolve-url-loader@5.0.0` source at
commit `e2695cde68f325f617825e168173df92236efb93`. The root is still a callable
CommonJS webpack loader with the enumerable `asGenerator`,
`createJoinImplementation`, `createJoinFunction`, `defaultJoinGenerator`, and
`defaultJoin` properties. Every shipped upstream `lib/*` entry remains
directly addressable; the package intentionally has no restrictive `exports`
map.

## Preserved behavior

- Webpack 4 uses source-relative output map sources; webpack 5 uses
  project-relative output map sources.
- Object and JSON-string input maps, missing-map warnings, malformed-map error
  categories, root-relative opt-in, query and fragment retention, and HTTP,
  data, module-relative, and empty URL pass-through remain unchanged.
- Custom joins keep their exact two-argument outer and one-argument inner
  contracts, lazy iterators, fallback ordering, deduplication, validation,
  diagnostics, and 100,000-iteration safety bound.
- The v4 `adjust-sourcemap-loader` processor and codecs from commit
  `5f173eef` are vendored byte-for-byte, with their MIT license, so codec
  behavior is not changed by an external package update.
- Node.js 12 and later are supported. Development-only webpack fixtures do not
  define the production runtime floor.

## Intentional correction

Source maps may expose a Windows file URL as `file:///D:/path/file.scss`.
Upstream removed `file://` and left `/D:/path`, which failed absolute-directory
validation on Windows. On Windows only, this package removes the extra slash
when the remaining path begins with a drive-letter segment. POSIX paths,
including the valid drive-looking URI `file:///D:/x`, retain their leading
slash.

## Additive surfaces

The package adds a default-and-named ESM facade, TypeScript declarations for
the loader and join APIs, scoped metadata, CI/CodeQL, and release-evidence
scripts. These additions do not alter CommonJS execution.

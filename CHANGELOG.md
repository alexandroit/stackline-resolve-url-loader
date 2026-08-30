# Changelog

## 1.0.1 - 2026-08-30

- Replace the archived `loader-utils@2.0.4` runtime dependency with the exact
  `loader-utils@npm:@stackline/loader-utils@1.0.2` compatibility alias.
- Preserve the complete Webpack 4 and 5 loader behavior through real downstream
  builds against the maintained dependency.
- Pin and inventory the complete production closure, including maintained leaf
  packages `emojis-list@3.0.0` and `json5@2.2.3`.
- Require warning-free clean installs, recursive dependency validation, exact
  license checks, and zero production/full npm audit findings before release.

## 1.0.0 - 2026-08-28

- Continue the complete `resolve-url-loader@5.0.0` callable CommonJS and join
  helper API.
- Vendor the exact `adjust-sourcemap-loader@4.0.0` processor and codecs.
- Correct Windows `file:///D:/...` normalization without changing POSIX file
  URLs.
- Add ESM, TypeScript declarations, webpack 4/5 and packed-consumer tests,
  license evidence, CI, CodeQL, and immutable artifact tooling.

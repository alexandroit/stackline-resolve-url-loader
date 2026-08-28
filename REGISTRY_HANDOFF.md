# Registry handoff: @stackline/resolve-url-loader 1.0.0

Observation date: 2026-08-28.

The one accepted artifact is
`release-candidate/stackline-resolve-url-loader-1.0.0.tgz`, built once from
source commit `5595617fc84396ab3874b06aab9a2e9546b86bdd` and tag
`stackline-v1.0.0`.

- SHA-1: `1b1856e5aeef738732137856617fecd5b525baf5`
- SHA-256: `3037fbe003806509e97dc8c472ada32411acf269b4bb6b4c602627dde46c613a`
- SHA-512: `321fae60bd3e9adecc406fb1a19340b124ff39da25f9fe48321e3f4edeb20770a1dfb9f5ecc2fb9a19d5c3b0bac2f73290923adea782f48ee860c8a5dff296fe`
- npm integrity: `sha512-Mh+uYL0+mt7MQG+xoZNAsST/Odol+f5IMh4/Tt6yB3Ch37n17ML7mhnVw7C6wvcykJI63qeC9I7oYMil3/KW/g==`
- Inventory: 76 files, 45,190 packed bytes and 171,542 unpacked bytes;
  every shipped regular file is mode `0644`.

The exact bytes were published to Verdaccio first, fetched byte-identically,
and exercised through clean direct scoped and historical-key npm alias
consumers. They were then published once to official npm by authenticated user
`alex360qc`. npm records publication at `2026-08-28T12:39:34.733Z`; its
tarball is byte-identical and the same consumer matrix passes.

Public source: https://github.com/alexandroit/stackline-resolve-url-loader.
The repository contains only `main`. The immutable release at
https://github.com/alexandroit/stackline-resolve-url-loader/releases/tag/stackline-v1.0.0
contains ten evidence assets, reports `immutable: true`, and serves the exact
registry tarball.

The initial remote CI release source passed Linux quality, packaging, Node
12-24, real Windows issue-239 behavior, Windows webpack 5 and CodeQL, but the
repository-only disposable webpack 4 harness hit `spawnSync npm.cmd EINVAL`
before installation. Main commit `631f49d11e31b22f2d0b15314719e32640a7540d`
corrects only that Windows batch invocation; it does not alter the immutable
artifact. The corrected main workflow is the durable remote Windows proof.

No version may be republished. Any future package change requires a new
version, tag, artifact, and immutable release.

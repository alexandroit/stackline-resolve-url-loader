# @stackline/resolve-url-loader

> Compatibility-first webpack Sass URL rebasing loader with maintained packaging and first-party types.

[![npm version](https://img.shields.io/npm/v/@stackline/resolve-url-loader.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/resolve-url-loader)
[![license](https://img.shields.io/npm/l/@stackline/resolve-url-loader.svg?style=flat-square)](https://github.com/alexandroit/stackline-resolve-url-loader)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-resolve-url-loader)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/resolve-url-loader/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/resolve-url-loader/)** | **[npm](https://www.npmjs.com/package/@stackline/resolve-url-loader)** | **[Issues](https://github.com/alexandroit/stackline-resolve-url-loader/issues)** | **[Repository](https://github.com/alexandroit/stackline-resolve-url-loader)**

**Current package version:** `1.0.6`

---

## Why this package?

A compatibility-first maintained continuation of `resolve-url-loader@5.0.0`.
It keeps the callable CommonJS webpack loader and its join helpers, while adding
an ESM facade, first-party TypeScript declarations, packed deep entries, and a
targeted fix for Windows drive paths decoded from `file:///D:/...` source-map
URLs.

This project is independent of and is not endorsed by Ben Holloway or the
upstream project. The upstream MIT license and attribution are preserved.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/resolve-url-loader@1.0.6` |
| Node.js runtime | `>=12` |
| CommonJS / primary entry | `./index.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./index.d.ts` |

## Installation

<a id="install"></a>

### Install

```sh
npm install @stackline/resolve-url-loader
```

Existing source can retain the historical package key with an npm alias:

```sh
npm install resolve-url-loader@npm:@stackline/resolve-url-loader
```

## Usage

Use it immediately after `sass-loader`, with source maps enabled throughout:

```js
module.exports = {
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        'css-loader',
        '@stackline/resolve-url-loader',
        { loader: 'sass-loader', options: { sourceMap: true } }
      ]
    }]
  }
}
```

The upstream `root`, `silent`, `removeCR`, `debug`, `sourceMap`, and `join`
options are unchanged. Query strings and fragments are always retained.

The runtime dependency graph is exact, recursively reviewed, and audit-clean.
The archived `loader-utils` project is replaced by the maintained
`@stackline/loader-utils` compatibility fork; no abandoned package remains in
the production graph.

## Features and Integrations

<a id="esm-and-join-helpers"></a>

### ESM and join helpers

```js
import loader, { defaultJoin, asGenerator } from '@stackline/resolve-url-loader'
```

CommonJS remains callable and carries the same five enumerable helper
properties:

```js
const loader = require('@stackline/resolve-url-loader')
const customJoin = loader.createJoinFunction('custom', implementation)
```

No restrictive `exports` map is used, so historical packed `lib/*` imports
continue to resolve. See [COMPATIBILITY_CONTRACT.md](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/COMPATIBILITY_CONTRACT.md),
[MIGRATION.md](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/MIGRATION.md), and the retained upstream guides in [docs](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/docs/).

## Security

Review inputs and the package-specific compatibility limits before processing untrusted data. Report suspected vulnerabilities as described in the [security policy](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/SECURITY.md).

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-resolve-url-loader.git
cd stackline-resolve-url-loader
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-resolve-url-loader/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## License

MIT. See [the license](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/LICENSE) for the complete terms.

Original authorship and third-party attribution are preserved in [NOTICE](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/NOTICE).

Dependency maintenance for this release is documented in [DEPENDENCY_UPDATES.md](DEPENDENCY_UPDATES.md).

## Credits and original authors

- Stackline Maintainers.
- Ben Holloway.
- Copyright (c) 2016 Ben Holloway.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.

# @stackline/resolve-url-loader

> Compatibility-first webpack Sass URL rebasing loader with maintained packaging and first-party types

[![npm version](https://img.shields.io/npm/v/@stackline/resolve-url-loader.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/resolve-url-loader)
[![license](https://img.shields.io/npm/l/@stackline/resolve-url-loader.svg?style=flat-square)](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/LICENSE)
[![GitHub repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-resolve-url-loader)

**[Documentation](https://alexandro.net/docs/vanilla/resolve-url-loader/)** |
**[npm](https://www.npmjs.com/package/@stackline/resolve-url-loader)** |
**[Issues](https://github.com/alexandroit/stackline-resolve-url-loader/issues)** |
**[Repository](https://github.com/alexandroit/stackline-resolve-url-loader)**

**Package version:** `1.0.4`

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
| Package | `@stackline/resolve-url-loader@1.0.4` |
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

## Community and Support

Report reproducible package issues in the [issue tracker](https://github.com/alexandroit/stackline-resolve-url-loader/issues). Use the [security policy](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/SECURITY.md) for vulnerability reports.

- [Stackline / Alexandro.Net](https://alexandro.net/)
- [GitHub](https://github.com/alexandroit)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)
- [Reddit community: r/Stackline](https://www.reddit.com/r/Stackline/)

## License

MIT. See [the license](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/LICENSE) for the complete terms.

Original authorship and third-party attribution are preserved in [NOTICE](https://github.com/alexandroit/stackline-resolve-url-loader/blob/main/NOTICE).

Dependency maintenance for this release is documented in [DEPENDENCY_UPDATES.md](DEPENDENCY_UPDATES.md).

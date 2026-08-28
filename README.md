# @stackline/resolve-url-loader

A compatibility-first maintained continuation of `resolve-url-loader@5.0.0`.
It keeps the callable CommonJS webpack loader and its join helpers, while adding
an ESM facade, first-party TypeScript declarations, packed deep entries, and a
targeted fix for Windows drive paths decoded from `file:///D:/...` source-map
URLs.

This project is independent of and is not endorsed by Ben Holloway or the
upstream project. The upstream MIT license and attribution are preserved.

## Install

```sh
npm install @stackline/resolve-url-loader
```

Existing source can retain the historical package key with an npm alias:

```sh
npm install resolve-url-loader@npm:@stackline/resolve-url-loader@1.0.0
```

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

## ESM and join helpers

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
continue to resolve. See [COMPATIBILITY_CONTRACT.md](COMPATIBILITY_CONTRACT.md),
[MIGRATION.md](MIGRATION.md), and the retained upstream guides in [docs](docs/).

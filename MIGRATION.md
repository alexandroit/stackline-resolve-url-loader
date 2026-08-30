# Migration

## Source-preserving npm alias

The lowest-risk migration keeps the historical dependency key:

```json
{
  "dependencies": {
    "resolve-url-loader": "npm:@stackline/resolve-url-loader@^1.0.2"
  }
}
```

Existing webpack rules and `require('resolve-url-loader/lib/...')` imports then
remain unchanged.

## Scoped imports

Alternatively, install `@stackline/resolve-url-loader` and change the loader
name in webpack configuration. Options and custom join functions do not need
conversion. ESM consumers may use the default facade and named join helpers.

Keep source maps enabled on `sass-loader`, this loader, and webpack itself.
Moving the loader earlier or later in the chain changes what source map it can
inspect and is not a supported migration.

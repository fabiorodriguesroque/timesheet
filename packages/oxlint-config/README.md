# `@repo/oxlint-config`

Shared [Oxlint](https://oxc.rs/docs/guide/usage/linter) configuration.

Extend it from a package's `.oxlintrc.json` (JSON configs only support relative paths):

```jsonc
{
  "extends": ["./node_modules/@repo/oxlint-config/base.json"]
}
```

Run with `oxlint --type-aware` to enable the type-aware rules (requires `oxlint-tsgolint` and TypeScript 7+).

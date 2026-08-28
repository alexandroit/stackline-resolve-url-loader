# Publishing

Releases are built once from reviewed source with:

```sh
STACKLINE_SOURCE_COMMIT=<40-hex-commit> \
STACKLINE_SOURCE_TAG=stackline-v1.0.0 \
STACKLINE_SOURCE_CLEAN=1 \
npm run artifact:prepare
```

The explicit metadata is required because this project may be staged inside a
larger workspace and the artifact script deliberately does not run Git against
that workspace root. The command refuses to replace an existing release
candidate, validates the frozen commit/tag/clean attestation, runs the complete
local gate, normalizes shipped file modes, and produces the exact tarball with
SHA-1/SHA-256/SHA-512 sums, inventory, license manifest, release notes, and
CycloneDX SBOM.

Test that exact tarball through a private Verdaccio registry with
`npm run test:registry` before any public publication. Publish the same bytes
once; never rebuild an accepted version or reuse its version number. Attach
the tarball and evidence files to an immutable source release.

This repository does not automate npm publication, repository creation, or
registry mutation. Those actions require an independently reviewed release
handoff.

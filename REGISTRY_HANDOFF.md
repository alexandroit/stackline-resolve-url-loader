# Registry handoff

Status: **not published and not registry-tested**. This implementation task was
limited to local build and validation; it did not start Verdaccio, mutate a
registry, create a repository, publish npm bytes, or create a remote release.

For a future authorized handoff:

1. Freeze and review the source, then run `npm run artifact:prepare` once.
2. Start an isolated Verdaccio instance and publish the exact tarball from
   `release-candidate/` to it.
3. Run `STACKLINE_TEST_REGISTRY=<url> npm run test:registry` and compare the
   downloaded tarball byte-for-byte with the accepted local artifact.
4. Review the manifest, all three checksum files, inventory, `licenses.json`,
   CycloneDX SBOM, and release notes.
5. Only with separate publication authority, publish those exact accepted
   bytes once and attach the same evidence to an immutable tagged release.

Do not rebuild version 1.0.0 after registry acceptance and do not record
publication evidence until official registry and release downloads have been
verified byte-identical.

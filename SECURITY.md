# Security policy

Security fixes are provided for the latest `@stackline/resolve-url-loader`
release. Report suspected vulnerabilities through the private GitHub security
advisory form at
https://github.com/alexandroit/stackline-resolve-url-loader/security/advisories/new.
Do not include exploit details in a public issue.

Reports should include the affected version, operating system, Node and
webpack versions, loader chain, smallest source/map reproducer, and impact.
Maintainers will acknowledge a report within five business days.

Source-map input is treated as build input, not as a network fetch. Custom join
functions execute with loader access by design and must be trusted webpack
configuration code.

Webpack 4 is tested through a disposable, exact-version consumer because its
abandoned development graph carries known advisories. That fixture is removed
after the compatibility build and is absent from this package's committed
development lock and production graph. Both committed-graph and production
audits are release gates.

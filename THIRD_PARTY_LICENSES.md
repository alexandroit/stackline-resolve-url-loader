# Third-party licenses

The package vendors the exact `adjust-sourcemap-loader@4.0.0` source-map
processor and codecs from commit `5f173eef`. Its unmodified MIT license is
included at `lib/vendor/adjust-sourcemap-loader/LICENSE`.

Production dependencies are installed as separate npm packages and retain
their own license files. For reproducible review, complete copies are also
shipped under `licenses/`; `npm run check:licenses` verifies every version,
license identifier, source text, and production lockfile component.

| Component | License | Shipped text |
| --- | --- | --- |
| adjust-sourcemap-loader 4.0.0 (vendored) | MIT | `lib/vendor/adjust-sourcemap-loader/LICENSE` |
| emojis-list 3.0.0 | MIT | `licenses/emojis-list-3.0.0-MIT.txt` |
| json5 2.2.3 | MIT | `licenses/json5-2.2.3-MIT.txt` |
| @stackline/loader-utils 1.0.2 | MIT | `licenses/stackline-loader-utils-1.0.2-MIT.txt` |
| nanoid 3.3.18 | MIT | `licenses/nanoid-3.3.18-MIT.txt` |
| picocolors 1.1.1 | ISC | `licenses/picocolors-1.1.1-ISC.txt` |
| postcss 8.5.26 | MIT | `licenses/postcss-8.5.26-MIT.txt` |
| regex-parser 2.3.1 | MIT | `licenses/regex-parser-2.3.1-MIT.txt` |
| source-map 0.6.1 | BSD-3-Clause | `licenses/source-map-0.6.1-BSD-3-Clause.txt` |
| source-map-js 1.2.1 | BSD-3-Clause | `licenses/source-map-js-1.2.1-BSD-3-Clause.txt` |

Transitive production components are inventoried from the frozen lockfile in
the same directory. The package's own [LICENSE](LICENSE) retains the upstream
resolve-url-loader MIT text, and [NOTICE](NOTICE) records independence and
attribution.

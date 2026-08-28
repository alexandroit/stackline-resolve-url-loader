import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: [
      'coverage/**',
      'lib/vendor/**',
      'release-candidate/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^(_|uri$)',
        caughtErrors: 'none',
        varsIgnorePattern: '^uri$'
      }],
      'no-useless-assignment': 'off',
      'no-useless-escape': 'off'
    }
  },
  {
    files: ['**/*.cjs', 'index.js', 'lib/**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { 'no-regex-spaces': 'off' }
  }
]

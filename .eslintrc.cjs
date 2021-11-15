/** @type {import("eslint/lib/shared/types").ConfigData} */
module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['standard'],
  ignorePatterns: ['dist', 'node_modules'],
  root: true,
  rules: {
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type']
      }
    ]
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['standard', 'plugin:@typescript-eslint/recommended-requiring-type-checking'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 12,
        project: ['./tsconfig.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/array-type': ['error', { default: 'generic' }],
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }]
      }
    }
  ]
}

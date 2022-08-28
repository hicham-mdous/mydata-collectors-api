module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    // "eslint:recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'linebreak-style': 0,
    'no-unused-expressions': [2, { allowShortCircuit: true }],
    'no-console': ['error', { allow: ['error', 'info'] }],
    '@typescript-eslint/no-var-requires': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['node_modules', ''],
      },
    },
  },
  ignorePatterns: ['build/*', 'src/database/migrations/*'],
};

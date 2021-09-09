const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
  ecmaVersion: 2020,
  sourceType: 'module',
};

const rules = {
  "@typescript-eslint/explicit-module-boundary-types": "off"
}

module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
  },
  extends: ['standard', 'prettier'],
  globals: {
    Sfdc: 'readonly',
    JSX: 'readonly',
  },
  parserOptions,
  rules,
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'standard',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions,
      rules
    },
  ],
};

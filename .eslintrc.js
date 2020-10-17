module.exports = {
  extends: ['@heibanfe/eslint-config-react'],
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': 'off',
    'max-params': 'off',
    semi: ['error', 'never'],
    'prettier/prettier': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-console': 'off',
    strict: ['error', 'global'],
    curly: 'warn',
    semi: ['error', 'never'],
    'prettier/prettier': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    camelcase: 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
}

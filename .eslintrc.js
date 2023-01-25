module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['prettier', 'airbnb-base', '@react-native-community'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-hooks/exhaustive-deps': 'off',
        semi: ['error', 'always'],
        'prettier/prettier': [
          'error',
          {},
          {
            usePrettierrc: false,
            singleQuote: true,
            parser: 'flow',
          },
        ],
      },
    },
  ],
};

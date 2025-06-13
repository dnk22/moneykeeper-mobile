module.exports = {
  // Môi trường chạy code
  env: {
    browser: true,
    es2021: true,
    node: true,
    'react-native/react-native': true,
  },
  // Kế thừa các cấu hình chung (áp dụng cho cả JS và TS trừ khi bị ghi đè)
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'airbnb', // Cấu hình Airbnb cơ bản (áp dụng cho JS)
    'airbnb/hooks',
    'prettier', // Tắt các quy tắc của ESLint xung đột với Prettier (áp dụng chung)
    'plugin:prettier/recommended', // Chạy Prettier như một quy tắc của ESLint (áp dụng chung)
  ],
  // Parser mặc định (có thể bị ghi đè trong overrides)
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  // Các plugin chung
  plugins: [
    'react',
    'react-native',
    'jsx-a11y',
    'prettier',
    'import', // Plugin import (cần cấu hình resolver)
  ],
  // Các quy tắc chung hoặc ghi đè
  rules: {
    'prettier/prettier': 'error',
    // Tắt quy tắc prop-types vì sẽ dùng TypeScript
    'react/prop-types': 'off',
    // Cho phép sử dụng named exports
    'import/prefer-default-export': 'off',
    // Có thể thêm các quy tắc chung khác ở đây
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    // Tắt quy tắc yêu cầu extension trong import (TypeScript xử lý tốt hơn)
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  // Cài đặt cho các plugin
  settings: {
    react: {
      version: 'detect',
    },
    // Cấu hình import resolver cho cả JS và TS
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.native.js', '.native.jsx', '.native.ts', '.native.tsx'],
      },
      typescript: {}, // Bật resolver cho TypeScript
    },
  },
  // Cấu hình đặc thù cho file TypeScript
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Áp dụng cho các file .ts và .tsx
      // Parser cho TypeScript
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json', // Quan trọng: Đường dẫn đến file tsconfig.json của bạn
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
      },
      // Kế thừa các cấu hình TypeScript
      extends: [
        'plugin:@typescript-eslint/recommended', // Các quy tắc recommended cho TypeScript
        'plugin:@typescript-eslint/recommended-requiring-type-checking', // Các quy tắc cần thông tin kiểu
        'airbnb-typescript', // Quy tắc Airbnb cho TypeScript
        'airbnb-typescript/ पद्मावत', // Quy tắc Airbnb cho Hooks trong TypeScript
        'prettier', // Tắt các quy tắc TypeScript xung đột với Prettier
        'plugin:prettier/recommended', // Chạy Prettier như một quy tắc (áp dụng trong override)
      ],
      // Các plugin TypeScript
      plugins: [
        '@typescript-eslint',
        'react',
        'react-native',
        'jsx-a11y',
        'prettier',
        'import',
      ],
      // Các quy tắc TypeScript cụ thể hoặc ghi đè
      rules: {
        // Các quy tắc chung từ phần trên cũng được áp dụng trừ khi bị ghi đè
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        // Ví dụ: Ghi đè quy tắc không cho phép sử dụng require (thường dùng trong Node)
        '@typescript-eslint/no-var-requires': 'off',
        // Ví dụ: Tắt quy tắc yêu cầu explicit function return type nếu không muốn
        '@typescript-eslint/explicit-function-return-type': 'off',
        // Ví dụ: Tắt quy tắc yêu cầu explicit module boundary types
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // Ví dụ: Tắt quy tắc yêu cầu non-null assertion
        '@typescript-eslint/no-non-null-assertion': 'off',
         // Cho phép sử dụng underscore ở đầu tên biến cho biến không dùng đến
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

        // Các quy tắc React Native đặc thù cho TypeScript
        'react-native/no-unused-styles': 'warn',
        'react-native/split-platform-components': 'warn',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-color-literals': 'warn',
        'react-native/no-raw-text': 'warn', // Quy tắc này có thể cần điều chỉnh cho TSX
      },
    },
  ],
};
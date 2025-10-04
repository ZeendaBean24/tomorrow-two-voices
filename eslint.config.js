// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

export default [
  // v9 way to ignore files (replaces .eslintignore)
  { ignores: ['dist', 'build', 'node_modules', '.vite', '*.config.*.ts'] },

  js.configs.recommended,
  ...tseslint.configs.recommended, // TS rules

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      'react/react-in-jsx-scope': 'off',
      ...reactHooks.configs.recommended.rules,
    },
    settings: { react: { version: 'detect' } },
  },

  // turn off rules that conflict with Prettier
  prettier,
]

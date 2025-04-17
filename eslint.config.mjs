// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Node.js built-ins
            ['^node:'],
            // Packages. (Nest, third-party)
            ['^(@nestjs|nestjs|rxjs|axios|express|mongoose|dotenv)(/.*|$)', '^\\w'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports (if used).
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error'
    },
  },
);
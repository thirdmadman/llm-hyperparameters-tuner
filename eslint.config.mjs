// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import globals from 'globals';
import { importX } from 'eslint-plugin-import-x';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';

export default defineConfig(
  {
    ignores: ['**/build/**', '**/dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    plugins: {
      react,
      'import-x': importX,
      perfectionist,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
      prettierConfig,
      eslintPluginPrettierRecommended,
      'import-x/flat/recommended',
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parserOptions: {
        projectService: true,
        ecmaFeatures: {
          jsx: true,
        },
        globals: {
          ...globals.serviceworker,
          ...globals.browser,
          ...globals.node,
        },
      },
    },
    settings: {
      'react': {
        version: 'detect',
      },
      'import/resolver': {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        typescript: true,
        node: true,
      },
    },
    rules: {
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['all', 'multiple', 'single', 'none'],
          allowSeparatedGroups: false,
        },
      ],
      'perfectionist/sort-exports': [
        'error',
        {
          order: 'asc',
          ignoreCase: false,
          groups: ['type-export', 'value-export'],
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/no-unresolved': [
        'error',
        {
          commonjs: true,
          amd: true,
        },
      ],
      'import/no-namespace': ['error', { ignore: ['*.ext'] }],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          'groups': [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index', 'type'], ['object']],
          'newlines-between': 'always',
          'pathGroups': [
            {
              pattern: '{react,react-dom/**,redux}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '*.{scss,css}',
              group: 'object',
              patternOptions: { matchBase: true },
              position: 'after',
            },
          ],
          'warnOnUnassignedImports': true,
          'pathGroupsExcludedImportTypes': ['react', 'react-dom/**'],
          'distinctGroup': false,
          'alphabetize': {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  }
);

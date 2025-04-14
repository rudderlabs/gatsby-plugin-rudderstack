import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-config-prettier';
import compat from 'eslint-plugin-compat';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import babelParser from '@babel/eslint-parser';

export default [
  {
    files: ['**/*.js'],
    ignores: [
      '.husky/**',
      'dist/**',
      'node_modules/**',
      'reports/**',
      'stats/**',
      '**/*.md',
      '**/*.d.ts',
      '**/*.json',
    ],
    languageOptions: {
      globals: {
        ...eslint.configs.recommended.globals,
        browser: true,
        window: true,
        document: true,
        navigator: true,
        location: true,
        history: true,
        localStorage: true,
        sessionStorage: true,
        process: true,
        console: true,
        jest: true
      },
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        }
      }
    },
    plugins: {
      'unicorn': unicorn,
      'compat': compat,
      'import': importPlugin,
      'sonarjs': sonarjs,
    },
    settings: {
      'import/resolver': {
        node: {}
      },
      lintAllEsApis: true,
      polyfills: [
        'URL',
        'URLSearchParams',
        'Promise',
        'Number.isNaN',
        'Number.isInteger',
        'Array.from',
        'Array.prototype.find',
        'Array.prototype.includes',
        'String.prototype.endsWith',
        'String.prototype.startsWith',
        'String.prototype.includes',
        'String.prototype.replaceAll',
        'Object.entries',
        'Object.values',
        'Object.assign',
        'Object.fromEntries',
      ]
    },
    rules: {
      'compat/compat': [
        'warn',
        'defaults,Edge >= 80,Firefox >= 47,IE >= 11,Chrome >= 54,Safari >= 7,Opera >= 43'
      ],
      'no-unused-vars': ['error', {
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
      'import/prefer-default-export': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
            kebabCase: true
          }
        }
      ],
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/consistent-destructuring': 'error',
      'unicorn/better-regex': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
      'sonarjs/prefer-immediate-return': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'sonarjs/max-switch-cases': 'off',
      'sonarjs/cognitive-complexity': ['error', 40],
      'no-console': 'off',
      'no-plusplus': 'off',
    }
  },
  prettier
];

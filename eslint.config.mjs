import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { files: ['./src/**/*.{js,ts}', './projects/**/*.{js,ts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['./src/**/*.{js,ts}', './projects/**/*.{js,ts}'], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ['**/dist/*', '**/node_modules/*', '**/coverage/*', '**/.angular/**'],
  },
]);

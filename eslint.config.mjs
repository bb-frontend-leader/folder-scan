import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importSort from 'eslint-plugin-simple-import-sort'
import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {
      js,
      'simple-import-sort': importSort
    },
    extends: ["js/recommended", eslintConfigPrettier],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // React y paquetes externos
            ['^[a-zA-Z0-9]', '^@?\\w'],

            // Dominios de Clean Architecture
            ['^@domain(/.*|$)'],
            ['^@application(/.*|$)'],
            ['^@infrastructure(/.*|$)'],
            ['^@presentation(/.*|$)'],
            ['^@shared(/.*|$)'],

            // Otros paquetes internos
            ['^(@|components)(/.*|$)'],

            // Importaciones con efectos secundarios (como CSS-in-JS o polyfills)
            ['^\\u0000'],

            // Importaciones relativas
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Padres primero
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Mismo nivel después
          ]
        }
      ]
    }
  },
  tseslint.configs.recommended,
]);
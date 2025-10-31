import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import nextTS from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTS,
  prettier, // Override default ignores of eslint-config-next.
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      // imports und exports sortieren / als warn deklarieren
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    // TODO rausfinden, welche Dateien noch ignoriert werden müssen
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
export default eslintConfig;

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
      // sorting of imports and exports sortieren / declaring warn
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // General best practices
      "no-console": ["warn", { allow: ["warn", "error"] }], // Allow only console.warn/error
      "no-debugger": "warn",
      eqeqeq: ["error", "always"], // Enforce strict equality
      "no-var": "error", // Disallow var declarations
      "prefer-const": "warn", // Prefer const over let when possible
      "prefer-arrow-callback": "warn",
      "no-implicit-coercion": "warn", // Avoid implicit type coercion (e.g. !!value, +x)
      "no-multi-assign": "error", // Disallow chained assignments
      "no-unused-expressions": "warn", // Avoid expressions used as statements

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/consistent-type-imports": "warn", // Enforce consistent use of type imports
      "@typescript-eslint/prefer-nullish-coalescing": "warn", // Encourage ?? over ||
      "@typescript-eslint/prefer-optional-chain": "warn", // Encourage optional chaining

      // React & JSX
      "react/self-closing-comp": "warn", // Prefer <Component /> over <Component></Component>
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ], // Remove unnecessary curly braces in JSX
      "react/jsx-no-useless-fragment": "warn", // Avoid redundant fragments
      "react/jsx-boolean-value": ["warn", "never"], // Use <Button disabled /> instead of disabled={true}

      // Potentially unsafe patterns
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-alert": "warn",
      "no-new-func": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
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

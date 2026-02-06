import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";
import eslint from '@eslint/js'; // Import eslint from @eslint/js

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

const eslintConfig = tseslint.config(
  eslint.configs.recommended, // Basic recommended ESLint rules
  ...tseslint.configs.recommended, // Recommended TypeScript ESLint rules
  {
    // This object is for configuring the parser for airbnb-typescript
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Next.js App Router doesn't require React to be in scope
      "react/react-in-jsx-scope": "off",
      // Supabase uses snake_case for DB columns, which conflicts with airbnb's camelcase rule.
      // Temporarily disabling due to complex peer dependency issues
      // "@typescript-eslint/naming-convention": "off",
      // Allow prop spreading for UI components
      "react/jsx-props-no-spreading": "off",
    },
  }
);

export default eslintConfig;
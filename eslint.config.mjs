import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

const eslintConfig = tseslint.config(
  ...compat.extends(
    "airbnb",
    "airbnb-typescript",
    "next/core-web-vitals",
    "prettier" // Must be last to override other configs
  ),
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
      "@typescript-eslint/naming-convention": "off",
      // Allow prop spreading for UI components
      "react/jsx-props-no-spreading": "off",
    },
  }
);

export default eslintConfig;

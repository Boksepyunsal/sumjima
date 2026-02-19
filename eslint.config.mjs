import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';
import eslint from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

const eslintConfig = tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'postcss.config.mjs',
      'next.config.ts',
      'jest.config.ts',
      'jest.setup.ts',
      '**/node_modules/**',
      '.next/**',
      '.husky/**',
      '.github/**',
      'coverage/**',
      'scripts/**',
      'storybook-static/**',
      '.storybook/**',
      'stories/**',
    ],
  },
  eslint.configs.recommended,
  // ...tseslint.configs.recommended, // Removed to avoid plugin redefinition conflict with airbnb-typescript
  ...compat.extends(
    'airbnb',
    'airbnb-typescript',
    'next/core-web-vitals',
    'prettier' // Must be last to override other configs
  ),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Next.js App Router doesn't require React to be in scope
      'react/react-in-jsx-scope': 'off',

      // Allow prop spreading for UI components (common in Radix UI / Shadcn)
      'react/jsx-props-no-spreading': 'off',

      // TypeScript handles prop types, so defaultProps are not strictly needed
      'react/require-default-props': 'off',

      // Prefer named exports over default exports in many cases
      'import/prefer-default-export': 'off',

      // Customize naming convention if needed (e.g., for Supabase snake_case)
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],

      // File extension rule for Next.js
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
    },
  }
);

export default eslintConfig;

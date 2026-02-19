import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (webpackConfig) => {
    if (!webpackConfig.resolve) webpackConfig.resolve = {};
    if (!webpackConfig.resolve.alias) webpackConfig.resolve.alias = {};
    if (!webpackConfig.module) webpackConfig.module = { rules: [] };
    if (!webpackConfig.module.rules) webpackConfig.module.rules = [];

    const alias = webpackConfig.resolve.alias as Record<string, string>;

    // @/ path alias (mirrors tsconfig paths)
    alias['@'] = path.resolve(__dirname, '..');

    // Replace supabase-provider with a Storybook-friendly mock
    alias['@/components/supabase-provider'] = path.resolve(
      __dirname,
      './mocks/supabase-provider.mock.tsx'
    );

    // Mock Next.js modules
    alias['next/link'] = path.resolve(__dirname, './mocks/next-link.mock.tsx');
    alias['next/navigation'] = path.resolve(
      __dirname,
      './mocks/next-navigation.mock.tsx'
    );

    // Ensure .tsx and .ts extensions are resolved
    if (!webpackConfig.resolve.extensions) {
      webpackConfig.resolve.extensions = [];
    }
    ['.tsx', '.ts', '.jsx', '.js'].forEach((ext) => {
      if (!webpackConfig.resolve!.extensions!.includes(ext)) {
        webpackConfig.resolve!.extensions!.push(ext);
      }
    });

    // Add TypeScript/JSX transpilation via Babel
    webpackConfig.module.rules.push({
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [
                require.resolve('@babel/preset-env'),
                { targets: { browsers: ['last 2 versions'] }, modules: false },
              ],
              [
                require.resolve('@babel/preset-react'),
                { runtime: 'automatic' },
              ],
              require.resolve('@babel/preset-typescript'),
            ],
          },
        },
      ],
    });

    // Remove existing CSS rules added by Storybook defaults and re-add with PostCSS
    webpackConfig.module.rules = (
      webpackConfig.module.rules as { test?: RegExp }[]
    ).filter(
      (rule) => !(rule.test instanceof RegExp && rule.test.test('.css'))
    );

    webpackConfig.module.rules.push({
      test: /\.css$/,
      use: [
        require.resolve('style-loader'),
        require.resolve('css-loader'),
        {
          loader: require.resolve('postcss-loader'),
          options: {
            postcssOptions: {
              config: path.resolve(__dirname, '..'),
            },
          },
        },
      ],
    });

    return webpackConfig;
  },
};

export default config;

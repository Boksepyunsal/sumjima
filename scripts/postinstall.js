#!/usr/bin/env node
// Creates a next/config shim so @storybook/nextjs@8 works with Next.js 16
// See: https://github.com/storybookjs/storybook/issues - next/config was removed in Next.js 16

const fs = require('fs');
const path = require('path');

const shimPath = path.resolve(__dirname, '../node_modules/next/config.js');
const shimContent = `// Shim for next/config (removed in Next.js 16, required by @storybook/nextjs@8)
function getConfig() { return {}; }
function setConfig(_config) {}
module.exports = getConfig;
module.exports.getConfig = getConfig;
module.exports.setConfig = setConfig;
module.exports.default = getConfig;
`;

fs.writeFileSync(shimPath, shimContent, 'utf8');
console.log('✓ Created next/config shim for @storybook/nextjs compatibility');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // antd v5+ is ESM only, so we need to transpile it and its dependencies.
  transpilePackages: ['antd', 'rc-util', '@ant-design/icons', 'rc-pagination', 'rc-picker', 'rc-input', '@ant-design/icons-svg', 'rc-motion'],
};

module.exports = nextConfig;

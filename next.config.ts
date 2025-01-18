/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config:any) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};

module.exports = {
  eslint: {
    // Disable the 'no-explicit-any' rule
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
};
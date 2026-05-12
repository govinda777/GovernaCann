/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure that the base path is correct for GitHub Pages if the repo is not a user/org page
  // base_path: '/GovernaCann',
};

module.exports = nextConfig;

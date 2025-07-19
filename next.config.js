/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'standalone' for now to test
  // output: 'standalone',
  
  reactStrictMode: true,
  
  // appDir is no longer needed - it's enabled by default in Next.js 13.4+
  // experimental: {
  //   appDir: true
  // }
}

module.exports = nextConfig
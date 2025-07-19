/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'standalone' for now to test
  // output: 'standalone',
  
  reactStrictMode: true,
  
  // Explicitly tell Next.js to look in both locations
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
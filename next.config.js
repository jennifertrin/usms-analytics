/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation to avoid SSR issues with client-side code
  // output: 'standalone',  // ← Comment this out temporarily
  // Remove the API proxy since we're using Next.js API routes
  // The API routes are now handled directly by Next.js in src/app/api/
  
  // Suppress hydration warnings for browser extensions like Grammarly
  reactStrictMode: true
}

module.exports = nextConfig
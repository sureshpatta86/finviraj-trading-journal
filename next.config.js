/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable better error reporting in development
  compiler: {
    removeConsole: false,
  },
  // Ensure we're in development mode
  reactStrictMode: true,
  // Temporarily ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add better error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed 'output: export' to enable API routes
  images: {
    unoptimized: true, // Firebase Functions doesn't support Next.js Image Optimization
  },
  distDir: '.next', // Default Next.js build directory
}

module.exports = nextConfig

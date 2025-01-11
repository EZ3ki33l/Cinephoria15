/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de base pour de meilleures performances
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    domains: ['utfs.io'],
  },
}

module.exports = nextConfig 
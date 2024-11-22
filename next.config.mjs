/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "utfs.io", protocol: "https", port: "" },
      { hostname : "via.placeholder.com" },
    ],
  },
  webpack: (config, { isServer }) => {
    // Si le code est bundlé pour le client (côté navigateur)
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      mode: "default", // Exemple, ajustez selon vos besoins
    },
  },

  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "utfs.io", protocol: "https", port: "" },
      { hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;

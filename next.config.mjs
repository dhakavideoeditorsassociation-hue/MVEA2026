/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Press coverage cards and hero slides reference images hosted by
    // arbitrary newspapers / CDNs, so the optimizer must accept any https host.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

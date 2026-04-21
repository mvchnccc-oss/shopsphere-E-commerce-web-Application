import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        pathname: "/Route-Academy-*/**"
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: "/**"
      },
      {
        protocol: 'http',
        hostname: '192.168.1.1',
        port: '8080',
        pathname: "/**"
      },
    ],
  },
};

export default nextConfig;

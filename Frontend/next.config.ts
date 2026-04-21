import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/Route-Academy-*/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.escuelajs.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rukminim2.flixcart.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeimg.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pravatar.cc",
        pathname: "/**",
      },

      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.1",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

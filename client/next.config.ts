import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'scontent.fevn4-2.fna.fbcdn.net', // previous domain
      'scontent.fevn4-1.fna.fbcdn.net', // new domain 
      'scontent.fevn4-3.fna.fbcdn.net', // new domain 
    ],
  },
};

export default nextConfig;

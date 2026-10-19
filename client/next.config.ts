import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
        domains: [
            "scontent.fevn4-2.fna.fbcdn.net",
            "scontent.fevn4-1.fna.fbcdn.net",
            "scontent.fevn4-3.fna.fbcdn.net",
        ],
    },
};

export default nextConfig;
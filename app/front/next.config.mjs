import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HS_REST_API_URL: process.env.HS_REST_API_URL,
    },
};

export default nextConfig;
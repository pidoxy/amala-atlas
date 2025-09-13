// File: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add this 'images' block
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.imgur.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;
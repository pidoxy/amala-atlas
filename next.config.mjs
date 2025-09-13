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
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'files.chowdeck.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;
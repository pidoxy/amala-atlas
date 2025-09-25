// File: next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // PWA is disabled in dev mode for faster hot-reloads
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'i.imgur.com' },
      { hostname: 'files.chowdeck.com' },
      { hostname: 'files.chowdeck.studio' }, // Good to have both chowdeck domains
      // Common auth/avatar providers
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'secure.gravatar.com' },
      { hostname: 'www.gravatar.com' },
    ],
  },
};

export default withPWA(nextConfig);
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Firebase Storage images (datasets/cover images) to be served
  // without needing a custom loader.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Keep builds strict so deploy fails fast on real errors, not on
  // ESLint nits — those are handled separately via `npm run lint`.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

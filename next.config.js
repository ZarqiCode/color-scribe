/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Don't fail build on TS errors during deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Don't run ESLint during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

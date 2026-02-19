/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_STOCK_API_KEY: process.env.NEXT_PUBLIC_STOCK_API_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  webpack: (config, { isServer }) => {
    if (!isServer && config.optimization.splitChunks.cacheGroups) {
      config.optimization.splitChunks.cacheGroups.charts = {
        test: /[\\/]node_modules[\\/](recharts|lightweight-charts)[\\/]/,
        name: 'charts',
        priority: 10,
        reuseExistingChunk: true,
        enforce: true,
      };
    }
    return config;
  },
};

export default nextConfig;

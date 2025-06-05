import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable React Server Components optimizations
    serverComponentsExternalPackages: ['zustand'],
    
    // Optimize CSS
    optimizeCss: true,
    
    // Enable gzip compression
    gzipSize: true,
  },

  // Bundle analyzer configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle analyzer for development
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('@next/bundle-analyzer')({
        enabled: true,
      })
      config.plugins.push(BundleAnalyzerPlugin)
    }

    // Optimize chunks for better loading
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for stable dependencies
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Common chunk for shared components
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
          // UI components chunk
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            priority: 8,
            reuseExistingChunk: true,
          },
        },
      }
    }

    return config
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Enable static optimization
  trailingSlash: false,
  
  // Power pack features
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirect configuration for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig; 
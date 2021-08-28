const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

const {
  SHOPIFY_ADMIN_APP_URL,
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOP_API_GATEWAY_URL
} = process.env;

module.exports = {
  webpack: (config) => {
    if (dev) {
      // Enable ESLint checking during development.
      config.plugins.push(new ESLintPlugin({ cache: true }));
    }

    if (!dev) {
      // Enable compression in production. Use Brotli which is superior to gzip.
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].br[query]',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { level: 11 },
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      );
    }

    // Add support for .mjs files.
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    return config;
  },

  // Prefix URL for all static assets. Disable prefixing in dev mode as this breaks mobile testing.
  assetPrefix: dev ? '' : SHOPIFY_ADMIN_APP_URL,

  target: 'serverless',
  trailingSlash: true,
  webpack5: true,
  env: {
    SHOPIFY_ADMIN_APP_API_KEY,
    SHOP_API_GATEWAY_URL
  }
};

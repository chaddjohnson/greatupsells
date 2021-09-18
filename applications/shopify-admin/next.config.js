const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const zlib = require('zlib');

const dev = process.env.NODE_ENV !== 'production';

const {
  ASSETS_URL,
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOPIFY_ADMIN_API_URL
} = process.env;

module.exports = {
  webpack: (config) => {
    if (dev) {
      // Enable ESLint checking during development.
      config.plugins.push(new ESLintPlugin({ cache: true }));
    }

    if (!dev) {
      // Enable compression in production.
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].br[query]',
          algorithm: 'gzip',
          test: /\.(js|css|html)$/,
          threshold: 10240,
          minRatio: 0.8
        })
      );
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].br[query]',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11
            }
          },
          threshold: 10240,
          minRatio: 0.8
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
  assetPrefix: dev ? '' : `${ASSETS_URL}/shopify-admin`,

  target: 'serverless',
  trailingSlash: true,
  webpack5: true,
  crossOrigin: 'anonymous',
  env: {
    SHOPIFY_ADMIN_APP_API_KEY,
    SHOPIFY_ADMIN_API_URL
  }
};

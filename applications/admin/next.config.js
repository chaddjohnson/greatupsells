const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const zlib = require('zlib');

const { NODE_ENV, ADMIN_API_URL } = process.env;
const dev = NODE_ENV !== 'production';

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
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html)$/,
          threshold: 10240,
          minRatio: 0.8
        })
      );
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path][base].br',
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

    return config;
  },
  target: 'serverless',
  trailingSlash: true,
  webpack5: true,
  crossOrigin: 'anonymous',
  assetPrefix: dev ? '/admin' : '',
  env: {
    ADMIN_API_URL
  }
};

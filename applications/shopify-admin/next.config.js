const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

dotenvExpand(dotenv.config());

const dev = process.env.NODE_ENV !== 'production';

const {
  SHOPIFY_ADMIN_APP_URL,
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOP_API_GATEWAY_URL
} = process.env;

module.exports = {
  webpack: (config) => {
    if (!dev) {
      config.plugins.push(new ESLintPlugin());

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

    // Necessary to use symlinked packages (Lerna creates symlinks in node_modules).
    config.resolve.symlinks = false;

    return config;
  },

  webpackDevMiddleware: (config) => {
    // Don't ignore all node modules.
    config.watchOptions.ignored = config.watchOptions.ignored.filter(
      (ignore) => !ignore.toString().includes('node_modules')
    );

    // Ignore all node modules except those here.
    config.watchOptions.ignored = [
      ...config.watchOptions.ignored,
      'node_modules/!(@neatowebsolutions)',
      '@neatowebsolutions/*/node_modules'
    ];

    return config;
  },

  // SSR instead of SSG is used as OAuth is handled within this app.
  target: 'serverless',

  // Prefix URL for all static assets. Disable prefixing in dev mode as this breaks mobile testing.
  assetPrefix: dev ? '' : SHOPIFY_ADMIN_APP_URL,

  trailingSlash: true,

  future: {
    webpack5: true
  },

  env: {
    SHOPIFY_ADMIN_APP_API_KEY,
    SHOP_API_GATEWAY_URL
  }
};

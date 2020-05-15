const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const withSass = require('@zeit/next-sass');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

dotenvExpand(dotenv.config({ path: '.env' }));

const dev = process.env.NODE_ENV !== 'production';

const {
  SHOPIFY_APP_URL,
  SHOPIFY_APP_API_KEY,
  SHOPIFY_APP_NAME,
  API_URL,
  CONTACT_EMAIL,
} = process.env;

module.exports = withSass({
  webpack: (config) => {
    if (dev) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      });
    }

    // Enable compression in production. Use Brotli which is superior to gzip.
    if (!dev) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].br[query]',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { level: 11 },
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        })
      );
    }

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
      /node_modules([\\]+|\/)+(?!@neatowebsolutions\/upselling-react-components)/,
      /\@neatowebsolutions\/upselling-react-components([\\]+|\/)node_modules/,
    ];

    return config;
  },

  target: 'serverless',
  assetPrefix: SHOPIFY_APP_URL,

  env: {
    SHOPIFY_APP_URL,
    SHOPIFY_APP_API_KEY,
    SHOPIFY_APP_NAME,
    API_URL,
    CONTACT_EMAIL,
  },
});

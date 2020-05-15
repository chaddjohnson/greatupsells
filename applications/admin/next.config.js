const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const webpack = require('webpack');
const withCss = require('@zeit/next-css');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

dotenvExpand(dotenv.config({ path: '.env' }));

const dev = process.env.NODE_ENV !== 'production';

const { ADMIN_APP_URL, API_URL } = process.env;

module.exports = withCss({
  webpack: (config) => {
    if (dev) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      });
    }

    config.plugins.push(new webpack.EnvironmentPlugin(['API_URL']));

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

    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]',
          esModule: false,
        },
      },
    });

    config.resolve.symlinks = false;

    return config;
  },

  // Generate page/index.html instead of page.html.
  exportTrailingSlash: true,

  assetPrefix: ADMIN_APP_URL,

  env: { API_URL },
});

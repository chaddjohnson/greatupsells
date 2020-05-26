const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const withCss = require('@zeit/next-css');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

dotenvExpand(dotenv.config({ path: '../../.env' }));

const dev = process.env.NODE_ENV !== 'production';

const { ADMIN_APP_URL, API_URL } = process.env;

module.exports = withCss({
  webpack: (config) => {
    if (dev) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader'
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
          deleteOriginalAssets: false
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
          esModule: false
        }
      }
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
      /node_modules\/(?!@neatowebsolutions\/.+)/,
      /\@neatowebsolutions\/.+\/node_modules/
    ];

    return config;
  },

  // Prefix URL for all static assets. Disable prefixing in dev mode as this breaks mobile testing.
  assetPrefix: dev ? '' : ADMIN_APP_URL,

  // Generate page/index.html instead of page.html.
  exportTrailingSlash: true,

  env: { API_URL }
});

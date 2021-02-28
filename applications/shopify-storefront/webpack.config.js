const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const getenv = require('getenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

dotenvExpand(dotenv.config({ path: '../../.env' }));

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'storefront.js'
  },
  stats: 'errors-warnings',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|dist)/,
        use: [
          { loader: 'cache-loader' },
          { loader: 'babel-loader' },
          { loader: 'eslint-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin(['STOREFRONT_API_GATEWAY_URL']),
    new CompressionWebpackPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ],
  resolve: {
    // Setting this to `true` allows dependency packages to be watched.
    symlinks: true,

    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat'
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: getenv.int('SHOPIFY_ADMIN_APP_STOREFRONT_PORT'),
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  }
};

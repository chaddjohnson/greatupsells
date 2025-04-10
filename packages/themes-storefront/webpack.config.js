const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');
const { addWebpackConfig } = require('@shopify/post-purchase-ui-react/webpack');

const dev = process.env.NODE_ENV !== 'production';

module.exports = addWebpackConfig({
  target: 'web',
  mode: dev ? 'development' : 'production',
  entry: {
    MultiProductOffer1: './src/MultiProductOffer1',
    MultiProductOffer2: './src/MultiProductOffer2',
    MultiProductOrderPageOffer1: './src/MultiProductOrderPageOffer1',
    PostPurchaseMultiProductOffer1: './src/PostPurchaseMultiProductOffer1',
    PostPurchaseSingleProductOffer1: './src/PostPurchaseSingleProductOffer1',
    SingleProductOffer1: './src/SingleProductOffer1',
    SingleProductOffer2: './src/SingleProductOffer2'
  },
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'this',
    publicPath: dev ? '/themes/' : '/'
  },
  cache: {
    type: 'filesystem'
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|dist)/,
        loader: 'babel-loader',
        options: {
          cacheCompression: false,
          cacheDirectory: true
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    dev && new ESLintPlugin({ cache: true }),
    !dev &&
      new CompressionWebpackPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
    !dev &&
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
  ].filter(Boolean),
  stats: 'errors-warnings',
  externals: ['facepaint', 'prop-types', 'react', 'react-dom', 'styled-components'],
  resolve: {
    // Setting this to `true` allows dependency packages to be watched.
    symlinks: true
  }
});

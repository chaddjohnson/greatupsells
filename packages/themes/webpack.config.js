const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const zlib = require('zlib');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'web',
  mode: dev ? 'development' : 'production',
  entry: {
    MultiProductOffer1: './src/themes/MultiProductOffer1',
    MultiProductOffer2: './src/themes/MultiProductOffer2',
    MultiProductThankYouOffer1: './src/themes/MultiProductThankYouOffer1',
    PostPurchaseMultiProductOffer1:
      './src/themes/PostPurchaseMultiProductOffer1',
    PostPurchaseSingleProductOffer1:
      './src/themes/PostPurchaseSingleProductOffer1',
    SingleProductOffer1: './src/themes/SingleProductOffer1',
    SingleProductOffer2: './src/themes/SingleProductOffer2'
  },
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  cache: {
    type: 'filesystem'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|dist)/,
        loader: 'babel-loader',
        options: {
          cacheCompression: false,
          cacheDirectory: true
        }
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
    dev && new ESLintPlugin({ cache: true })
  ].filter(Boolean),
  stats: 'errors-warnings',
  externals: [
    'facepaint',
    'prop-types',
    'react',
    'react-dom',
    'styled-components'
  ],
  resolve: {
    // Setting this to `true` allows dependency packages to be watched.
    symlinks: true
  }
};

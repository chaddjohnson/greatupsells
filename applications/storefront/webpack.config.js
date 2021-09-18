const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const getenv = require('getenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const zlib = require('zlib');

const dev = process.env.NODE_ENV !== 'production';

dotenvExpand(dotenv.config({ path: '../../.env' }));

module.exports = {
  target: 'web',
  mode: dev ? 'development' : 'production',
  entry: './src/index.js',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'storefront.js',
    publicPath: '/'
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
    new webpack.EnvironmentPlugin(['STOREFRONT_API_URL']),
    dev && new ESLintPlugin({ cache: true }),
    new CompressionWebpackPlugin({
      filename: '[path].br[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
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
  ].filter(Boolean),
  stats: 'errors-warnings',
  resolve: {
    // Setting this to `true` allows dependency packages to be watched.
    symlinks: true,

    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: getenv.int('STOREFRONT_PORT', 4002),
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  }
};

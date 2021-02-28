const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
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
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()],
  stats: 'errors-warnings',
  externals: ['moment-timezone', 'prop-types', 'react', 'react-dom']
};

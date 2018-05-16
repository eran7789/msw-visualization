const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const baseConfig = require('./base.webpack.config');

const buildPath = path.join(__dirname, 'src', 'server', 'utils', 'ssr');

const config = {
  target: 'node',
  entry: './ssr-utils.js',
  output: {
    path: buildPath,
    filename: 'index.js',
    library: 'ssrUtils',
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: 'ignore-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin([buildPath]),
    new webpack.DefinePlugin({ 'global.GENTLY': false })
  ]
};

module.exports = merge.smart(config, baseConfig);

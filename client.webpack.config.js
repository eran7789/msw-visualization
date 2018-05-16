const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const dotenv = require('dotenv');

dotenv.config({
  dotEnvName: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

const baseConfig = require('./base.webpack.config');

const buildPath = path.join(__dirname, 'src/server/static/app');

const appDependencies = [
  'lodash',
  'prop-types',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'redux',
  'redux-actions',
  'redux-logger'
];

const config = {
  target: 'web',
  entry: {
    bundle: 'index.js',
    vendor: appDependencies
  },
  output: {
    path: buildPath,
    filename: 'js/[name].[hash].js'
  },

  plugins: [
    new CleanWebpackPlugin([buildPath]),
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL)
    })
  ],

  module: {
    rules: [
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },

  devServer: {
    contentBase: buildPath,
    publicPath: '/',
    noInfo: true,
    inline: true
  }
};

module.exports = merge.smart(config, baseConfig);

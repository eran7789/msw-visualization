const path    = require('path');
const webpack = require('webpack');

const env         = process.env.NODE_ENV || 'development';
const src         = path.join(__dirname, 'src/client');
const sharedUtils = path.join(__dirname, 'src/shared-utils');
const modulesPath = 'node_modules';

const config = {
  mode: process.env.NODE_ENV || 'development',
  context: src,
  devtool: env === 'production' ? 'source-map' : 'inline-source-map',
  output: { publicPath: '/app/' },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) })
    // https://github.com/reactjs/redux/issues/1029
  ],

  resolve: {
    modules: [
      modulesPath,
      src
    ],
    alias: {
      'shared-utils': sharedUtils
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader?cacheDirectory',
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: 'ignore-loader'
      },
      {
        test: require.resolve('react'),
        use: 'expose-loader?React'
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|woff|woff2|ttf|otf|ogg)(\?.*)?$/i,
        use: 'url-loader?limit=5120&name=[path][name].[hash].[ext]'
      }
    ]
  }
};

module.exports = config;

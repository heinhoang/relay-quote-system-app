const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    // init react HRM
    'react-hot-loader/patch',
    // init dev server reload
    // 'webpack-dev-server/client?http://localhost:3000', 
    // init browser reload
    // 'webpack/hot/only-dev-server', 
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    './app.js'
  ],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'public'),
    publicPath: '/'
  },

  context: resolve(__dirname, 'js'),

  devtool: 'inline-source-map',

  devServer: {
    // enable server reload
    hot: true,
    // enable browser reload
    inline: true,
    port: 3000,
    contentBase: resolve(__dirname, 'public'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/
      }
    ],
  },

  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
  ],
};
const path = require('path');
const webpack = require('webpack');
const port = 3030;

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  devServer: { port },
  entry: './app/index',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: `http://localhost:${port}/js/`
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-0', 'react', 'react-hmre']
      }
    }]
  }
};

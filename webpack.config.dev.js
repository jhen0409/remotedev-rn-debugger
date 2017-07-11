/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true }]*/

const webpack = require('webpack');

const port = 3030;

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  devServer: { port },
  entry: './app/index',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: `http://localhost:${port}/js/`,
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['react'],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },
};

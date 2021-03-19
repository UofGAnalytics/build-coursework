const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: path.join(__dirname, 'src/index.ts'),
  mode: isProd ? 'production' : 'development',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward'
            }
          },
        ]
      }
    ]
  },
  externals: [nodeExternals({ modulesFromFile: true })],
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: '../template/build', to: 'template' },
      ],
    }),
  ],
  optimization: {
    minimize: false,
  },
};

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const ShebangPlugin = require('webpack-shebang-plugin');

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    compiler: path.join(__dirname, 'src/index.ts'),
    cli: path.join(__dirname, 'src/cli/cli.ts')
  },
  mode: isProd ? 'production' : 'development',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward'
            }
          },
        ]
      },
      // {
      //   test: /\/assets\//,
      //   use: 'raw-loader',
      // },
      // {
      //   test: /\/template\/build\//,
      //   use: 'raw-loader',
      // },
    ]
  },
  externals: [nodeExternals({ modulesFromFile: true })],
  plugins: [
    new CleanWebpackPlugin(),
    new ShebangPlugin(),
    // new CopyPlugin({
    //   patterns: [
    //     { from: 'assets', to: 'assets' },
    //     { from: '../template/build', to: 'assets' },
    //   ],
    // }),
  ],
  optimization: {
    minimize: false,
  },
};
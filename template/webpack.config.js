const path = require('path');
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { template } = require('lodash')

const isProd = process.env.NODE_ENV === 'production';

const html = fs.readFileSync('./public/index.html', 'utf-8')

const entry = [
  path.join(__dirname, 'src/index.ts'),
]

const plugins = []

if (isProd) {
  plugins.push(
    new CleanWebpackPlugin(),
  )
}

plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  }),
)

if (!isProd) {
  entry.push(
    path.join(__dirname, 'public/dev.ts')
  )
  plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => {
        const props = {
          //
        }
        return template(html)({ ...props, htmlWebpackPlugin })
      },
    }),
  )
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'cheap-module-source-map',
  entry,
  target: 'web',
  output: {
    path: isProd ? path.join(__dirname, 'build') : undefined,
    filename: '[name].js',
    publicPath: '',
    pathinfo: !isProd
  },
  resolve: {
    extensions: ['.ts', '.js', '.css', '.svg', '.html']
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
      },
      {
        test: /\.css$/,
        use: [
          isProd
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader'
        ]
      },
      // for inlining SVG icons in CSS files
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
      // for importing sample coursework in dev mode
      {
        test: /\.html$/,
        include: [/\/fixture\//],
        loader: 'raw-loader'
      }
    ]
  },
  plugins,
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000,
    stats: 'minimal',
    clientLogLevel: 'silent',
    hot: true
  }
};

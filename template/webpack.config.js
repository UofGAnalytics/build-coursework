const path = require('path');
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;
const {
  MiniHtmlWebpackPlugin,
  generateCSSReferences,
  generateJSReferences
} = require('mini-html-webpack-plugin');

const COURSE = 'apm'
const UNIT = 'week-2.html'
const htmlFilePath = `../fixtures/${COURSE}/build/${UNIT}`

const isProd = process.env.NODE_ENV === 'production';

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  }),
]

if (isProd) {
  plugins.push(
    new CleanWebpackPlugin(),
  )
}

if (!isProd) {
  plugins.push(
    new WatchExternalFilesPlugin({ files: [htmlFilePath] }),
    new MiniHtmlWebpackPlugin({ template })
  )
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'cheap-module-source-map',
  entry: {
    template: path.join(__dirname, 'src/index.ts')
  },
  target: 'web',
  output: {
    path: isProd ? path.join(__dirname, 'build') : undefined,
    filename: '[name].js2', // non-standard ext to make it easier to import as static file in the compiler
    publicPath: '',
    pathinfo: !isProd
  },
  resolve: {
    extensions: ['.ts', '.js', '.css', '.svg', '.html', '.ttf']
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
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          "sass-loader",
        ]
      },
      // for inlining SVG icons in CSS files
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
      {
        test: /\.ttf$/,
        loader: 'base64-inline-loader',
        // use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
      },
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

function template({ css, js2 }) {
  const cssTags = generateCSSReferences({ files: css })
  const jsTags = generateJSReferences({ files: js2 })
  const content = fs.readFileSync(htmlFilePath, 'utf-8')
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Coursework</title>
        ${cssTags}
      </head>
      <body>
        ${content}
        <div id="modal">
          <div id="modal-bg"></div>
          <div id="modal-wrapper">
            <div id="modal-close"></div>
            <div id="modal-content"></div>
          </div>
        </div>
        ${jsTags}
      </body>
    </html>
  `
}

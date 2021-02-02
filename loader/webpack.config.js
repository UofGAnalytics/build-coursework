const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackInjector = require('html-webpack-injector');

module.exports = {
  mode: 'development',
  entry: path.resolve('../example/course.yaml'),
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
    // publicPath: '',
  },
  resolve: {
    extensions: ['.yaml']
  },
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: [
          // 'file-loader?name=[name].[ext]',
          // 'extract-loader',
          'html-loader',
          path.resolve('./loader.js')
        ]
      },
      {
        test: /\.html$/,
        use: [
          // 'file-loader?name=[name].[ext]',
          // 'extract-loader',
          'html-loader',
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   // inject: false,
    //   // base: '/',
    //   // template: path.join(__dirname, 'index.html')
    // }),
    // new HtmlWebpackInjector()
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    publicPath: '/',
    historyApiFallback: true,
    disableHostCheck: true,
    port: 3000,
    stats: 'minimal',
    clientLogLevel: 'silent',
    // hot: true
  }
};

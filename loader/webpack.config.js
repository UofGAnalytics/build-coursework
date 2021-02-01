const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'course.yaml'),
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '',
  },
  resolve: {
    extensions: ['.yaml']
  },
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: [
          {
            loader: path.resolve('./loader.js')
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
};

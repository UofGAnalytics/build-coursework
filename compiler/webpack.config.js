import path from "path";
import fs from 'fs'
import nodeExternals from "webpack-node-externals";
import CopyPlugin from "copy-webpack-plugin";
import ShebangPlugin from "webpack-shebang-plugin";
import InlineEnvironmentVariablesPlugin from "inline-environment-variables-webpack-plugin";
import GeneratePackageJsonPlugin from "generate-package-json-webpack-plugin";

const pkg = JSON.parse(await fs.promises.readFile('./package.json', 'utf-8'));
const isProd = process.env.NODE_ENV === 'production'
const __dirname = new URL('.', import.meta.url).pathname;

export default {
  target: ['node', 'es2020'],
  mode: isProd ? 'production' : 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/cli/cli.ts',
  stats: 'errors-only',
  resolve: {
    extensions: ['.ts', '.js', '.css']
  },
  output: {
    clean: true,
    path: path.join(__dirname, 'build'),
    filename: 'cli.js',
  },
  externals: nodeExternals({
    importType: 'module',
    modulesFromFile: true,
  }),
  optimization: {
    minimize: false,
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
        test: /\/assets\//,
        use: 'raw-loader',
      },
      // {
      //   test: /\/template\/build\//,
      //   use: 'raw-loader',
      // },
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new ShebangPlugin(),
    new GeneratePackageJsonPlugin(
      {
        "name": 'build-coursework',
        "version": pkg.version,
        "license": "MIT",
        "bin": {
          "rmarkdown": "./cli.js"
        },
      },
      path.join(__dirname, 'package.json')
    ),
    new InlineEnvironmentVariablesPlugin({ VERSION: '1.1.30' }),
    new CopyPlugin({
      patterns: [
        { from: './src/knitr/knitr.R', to: './' },
      ],
    }),
  ],
};

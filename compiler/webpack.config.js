import path from "path";
import fs from 'fs'
import { fileURLToPath } from 'url';
import nodeExternals from "webpack-node-externals";
import CopyPlugin from "copy-webpack-plugin";
import ShebangPlugin from "webpack-shebang-plugin";
import InlineEnvironmentVariablesPlugin from "inline-environment-variables-webpack-plugin";
import GeneratePackageJsonPlugin from "generate-package-json-webpack-plugin";

const isProd = process.env.NODE_ENV === 'production'
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildPath = path.join(__dirname, 'build')
const projectPath = path.join(__dirname, '..')
const releasePath = path.join(projectPath, 'release')
const projectPkg = JSON.parse(await fs.promises.readFile(path.join(projectPath, 'package.json'), 'utf-8'));
const releasePkg = JSON.parse(await fs.promises.readFile(path.join(releasePath, 'package.json'), 'utf-8'));

const currentVersion = releasePkg.version
const newVersion = projectPkg.version

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
    path: buildPath,
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
    // parser: {
    //   javascript: { importMeta: false }
    // },
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
        test: /[\\\/]+assets[\\\/]+/,
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
        // use current version when building release so
        // release-it can automatically increment the version
        "version": currentVersion,
        "repository": "https://github.com/UofGAnalytics/build-coursework.git",
        "author": "David McArthur <david.mcarthur.2@glasgow.ac.uk>",
        "license": "MIT",
        "bin": {
          "rmarkdown": "./cli.js"
        },
      },
      path.join(__dirname, 'package.json')
    ),
    new InlineEnvironmentVariablesPlugin({ VERSION: newVersion }),
    new CopyPlugin({
      patterns: [
        { from: './src/knitr/knitr.R', to: './' },
      ],
    }),
  ],
};

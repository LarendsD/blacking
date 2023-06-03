/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV ?? 'development';

module.exports = [
  {
    mode: env,
    entry: ['./backend/src/main.ts', 'webpack/hot/poll?100'],
    target: 'node',
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
        modulesDir: './backend/node_modules'
      }),
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new RunScriptWebpackPlugin({ name: 'server.js', autoRestart: false }),
    ],
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      path: path.join(__dirname, './backend/dist'),
      filename: 'server.js',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
  },
  {
    mode: env,
    entry: './frontend/index.js',
    plugins: [
      new HtmlWebpackPlugin({ template: './frontend/index.html' }),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'frontend/dist'),
      filename: 'client.js',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
  },
];

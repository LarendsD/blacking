/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV ?? 'development';

module.exports = [
  {
    mode: env,
    entry: './frontend/index.js',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: 'client.js',
      clean: true,
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './frontend/app/public/index.html' }),
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
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
  },
];

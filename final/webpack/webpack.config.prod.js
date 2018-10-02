const path = require('path');
const webpack = require('webpack');
const postcssinlinesvg = require('postcss-inline-svg');
const postcsscssnext = require('postcss-cssnext')();

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        APP_NAME: JSON.stringify(process.env.APP_NAME),
        WEBPACK: true,
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src', 'assets'),
        to: path.resolve(__dirname, '../dist', '../assets'),
      },
    ]),
    new webpack.optimize.UglifyJsPlugin({
      beautify: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        join_vars: true,
        if_return: true,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin('bundle.css'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                postcsscssnext,
                postcssinlinesvg({ path: path.resolve(__dirname, '../src/assets') }),
              ],
            },
          },
        ],
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  postcsscssnext,
                  postcssinlinesvg({ path: path.resolve(__dirname, '../src/assets') }),
                ];
              },
            },
          },
          'sass-loader',
        ],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 2000,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
};

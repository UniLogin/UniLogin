const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'main.[hash].js',
    path: path.join(__dirname, '/dist/html'),
    publicPath: '/',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
        exclude: /node_modules/,
      },
      {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
      {
        test: /\.(png|jpg|gif|svg|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: './src/ui/assets/logo.ico',
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.NETWORK': JSON.stringify(process.env.NETWORK),
      'process.env.TOKENS': JSON.stringify(process.env.TOKENS),
      'process.env.RELAYER_URL': JSON.stringify(process.env.RELAYER_URL),
      'process.env.ENS_DOMAINS': JSON.stringify(process.env.ENS_DOMAINS),
      'process.env.JSON_RPC_URL': JSON.stringify(process.env.JSON_RPC_URL),
      'process.env.RAMP_API_KEY': JSON.stringify(process.env.RAMP_API_KEY),
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    }),
    new CopyPlugin([
      {from: './src/ui/assets/jarvis-web-clip.png'},
      {from: './src/_redirects'},
    ]),
  ],
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    compress: true,
    stats: 'errors-only',
  },
  node: {
    fs: 'empty',
  },
  stats: 'minimal',
};

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/ui/iframe.tsx',
  output: {
    filename: 'main.[hash].js',
    path: path.join(__dirname, '/dist/html'),
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
      template: './src/ui/index.html',
    }),
    new CopyPlugin([
      {from: './src/ui/copyToClipboard.html', to: './copy/index.html'},
      {from: './src/ui/styles/copyToClipboard.css', to: './copy/src/ui/styles/copyToClipboard.css'},
      {from: './src/ui/assets/U.svg', to: './copy/src/ui/assets/U.svg'},
      {from: './src/ui/assets/LogoTitle.png', to: './image/LogoTitle.png'},
    ]),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    compress: true,
    stats: 'minimal',
  },
  node: {
    fs: 'empty',
  },
  stats: 'minimal',
};

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const Dotenv = require("dotenv-webpack")
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'main.[hash].js',
    path: __dirname + '/dist'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.TOKEN_CONTRACT_ADDRESS': JSON.stringify(process.env.TOKEN_CONTRACT_ADDRESS)
    })
  ],
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    compress: true
  },
  node: {
    fs: 'empty'
  }
}

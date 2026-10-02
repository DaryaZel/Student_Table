const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => ({
  entry: ['./src/index'],

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/app.js',
    publicPath: '..'
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    overlay: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: "file-loader",
        options: {
          name: '[name].[ext]',
          outputPath: '/assets/images/'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: argv.mode === 'production' ? false : 'cheap-module-eval-source-map'
});

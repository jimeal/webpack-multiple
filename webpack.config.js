const path = require("path")
const webpack = require("webpack")
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const apiMocker = require("connect-api-mocker");
const pages = require("./src/pages");


const mode = process.env.NODE_ENV || "development";

module.exports = {
  //mode: "development",
  mode,
  entry: {
    main: "./src/app.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]?[hash]',
            limit: 20000
          }
        }
      }
    ]
  },
  plugins: [
    ...pages.map(e => {
      return new HtmlWebpackPlugin({
        template: `./src/template/${e}.html`,
        title: `${e} Training`,
        filename: `${e}.html`,
        minify: process.env.NODE_ENV === 'production' ? {
                  collapseWhitespace: true, // 빈칸 제거
                  removeComments: true, // 주석 제거
                } : false,
        favicon: "favicon.ico",
        hash: true,
        meta: {
                xua: {
                    httpEquiv: 'X-UA-Compatible',
                    content: 'IE=edge'
                },
                mobile: {
                  name: 'viewport',
                  constent: '"width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"'
                },
                anotherName: { 
                    name: 'description',
                    content: 'description goes here'
                }
              }
      })
    }),
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
        Author: ${childProcess.execSync('git config user.name')}
      `
    }),
    new webpack.DefinePlugin({
      TWO: 1+1,
      THREE: '1+2',
      'api.domain': JSON.stringify('http://dev.api.domain.com')
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({filename: `[name].css`})]
      : []),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    publicPath: "/",
    host: "localhost",
    overlay: true,
    //port: 8081,
    stats: "errors-only",
    //historyApiFallback: true
    before: app => {
      app.use(apiMocker('/api', 'mocks/api'));
    },
    hot: true,
    // proxy: {
    //   '/api': "http://localhost:8081"
    // },
  }
}
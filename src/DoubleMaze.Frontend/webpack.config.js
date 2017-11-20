"use strict";

//https://medium.com/chuckblog/using-typescript-with-vue-js-single-file-components-aaf51cbf5603

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./app.ts",
    output: {
        filename: "../DoubleMaze/wwwroot/js/bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", '.vue', ".js", ".json"],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
          {
              test: /\.ts$/,
              exclude: /node_modules|vue\/src/,
              loader: 'ts-loader',
              options: {
                  appendTsSuffixTo: [/\.vue$/]
              }
          },
          {
              exclude: /node_modules/,
              test: /\.css$/,
              loader: ExtractTextPlugin.extract( 'css-loader')
          },
             { 
                 test: /\.vue$/, 
                 loader: 'vue-loader', 
                 options: { 
                     esModule: true,
                 }
             },

          {
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]?[hash]'
              }
          }
        ]
    },
    plugins: [
        new ExtractTextPlugin('bundle.css')//"../DoubleMaze/wwwroot/css/components.css")
    ]
};
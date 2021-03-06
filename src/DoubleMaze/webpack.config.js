﻿module.exports = {
    entry: './Scripts/app.ts',
    output: {
        filename: './wwwroot/js/bundle.js',
        path: __dirname
    },
    module: {
        rules: [
          {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
          }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: 'inline-source-map',
};
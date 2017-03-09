const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

const config = {
  entry: './debug.js',
  output: {
    // path: path.resolve(__dirname, '../dist'),
    filename: './script-min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: [ [ 'es2015', { modules: false, loose: true  } ] ]

        }
      },
      {
          test: /\.json$/,
          loaders: [ 'json-loader' ]
      },
      { 
          test: /\.css$/,
          loaders: [ 'style-loader', 'css-loader', 'autoprefixer-loader' ]
      },
      { 
          test: /\.less$/,
          loaders: [ 'style-loader', 'css-loader', 'autoprefixer-loader', 'less-loader' ]
      },
      {
          test: /\.scss$/,
          loaders: [ 'style-loader', 'css-loader', 'autoprefixer-loader', 'sass-loader' ]
      },
      { 
          test: /\.html$/,
          loaders: [ 'underscore-template-loader' ] 
      },
      {
          test: /\.(csv|tsv)$/,
          loaders: [ 'dsv-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
    })
 ]
};

module.exports = config;
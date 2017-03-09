const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

//process.traceDeprecation = true;

const config = {
  entry: './debug.js',
  output: {
    //path: __dirname,
    filename: './script.js'
  },
  devtool: 'inline-source-map',
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
        minimize: false,
        debug: true
        //devtool: 'inline-source-map'
    })
 ]
};

module.exports = config;
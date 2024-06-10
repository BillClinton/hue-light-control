const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'light-button.js',
    path: path.resolve(__dirname, 'dist'),
  },
  //   optimization: {
  //     runtimeChunk: 'single',
  //   },
};

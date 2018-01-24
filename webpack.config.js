const path = require('path')

module.exports = {
  entry: {
    controller: './client/controller/index',
    host: './client/host/index',
    home: './client/home/index'
  },
  output: {
    filename: 'bundle.[name].js',
    path: path.resolve('./static/game')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'buble-loader'
      }
    ]
  },
  devtool: 'cheap-source-map'
}

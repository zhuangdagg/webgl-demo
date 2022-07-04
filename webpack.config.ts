const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main-[hash:18].js'
  },
  name: 'webgl-demo',
  devServer: {
    port: 7001,
    open: true,
    // 开始监听端口
    onListening: function(devServer) {
      if(!devServer) {
        throw new Error('webpack-dev-server is not defined!')
      }
    }
  },
  module: {
    rules: [
      { test: /\.ts$/, exclude: /node_modules/, use: 'ts-loader'},
      { test: /\.glsl$/, loader: 'raw-loader' },
    ]
  },
  resolve: {
    extensions: [".ts", ".json",".scss",".glsl",'.js'],
    alias: {
      '/@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    // 每次构建清空dist
    new CleanWebpackPlugin(),
    
    new htmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html'
    }),
  ]
}

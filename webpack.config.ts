import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import Server from 'webpack-dev-server'
import { start } from 'repl'

// 入口
const entry = ['main', 'texture-demo']

const entryConfig = {}
const pluginConfig = entry.map(item => {
  entryConfig[item] = path.join(__dirname, `./src/pages/${item}.ts`)
  return new HtmlWebpackPlugin({
    template: 'public/index.html',
    filename: `${item}.html`,
    favicon: './public/npm.png',
    chunks: [item]     // 必填，否则每个模版文件中均引入所有的 js 和 css 文件
  })
})

export default <Server.WebpackConfiguration> {
  mode: 'production',
  entry: {...entryConfig},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  name: 'webgl-demo',
  devServer: {
    port: 7001,
    open: ['main.html', 'texture-demo.html'],
    // openPage: 'texture-demo.html',
    // 开始监听端口
    onListening: function(devServer: any) {
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
    ...pluginConfig,
  ]
}

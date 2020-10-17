const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  /**
   * https://webpack.js.org/configuration/target/
   * webpack可以针对多种环境或目标进行编译。
   * 比如一些内置模块的区别，在electron-main环境，webpack就会识别出app, ipc等模块为内建模
   * 块，打包的时候就不需要再去node_modules查找这些模块。
   * target设置为`electron-main`，webpack打包时就会将多个electron特有的变量包含进来。
   */
  // target: 'electron-preload',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      app: path.resolve(__dirname, '../app'),
      resources: path.resolve(__dirname, '../resources'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000, /* 图片大小小于1000字节限制时会自动转成 base64 码引用*/
              name: '[path][name].[ext]'
            }
          },
          /*对图片进行压缩*/
          {
            loader: 'image-webpack-loader',
            query: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
          // {
          //   loader:'url-loader?limit=5000&name=[path][name].[ext]?[hash:6]!./dir/file.png'
          // }
        ]
      }
    ],
  },
  output: {
    path: path.join(__dirname, '../'),
    filename: './dist/main/[name].js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: 'source-map',
  plugins: [
    new Dotenv()
  ]
}

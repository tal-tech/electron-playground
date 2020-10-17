const webpack = require('webpack')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin') //https://terser.org/

const baseConfig = require('./webpack.config.base')

module.exports = merge.smart(baseConfig, {
  mode: 'production',
  target: 'electron-main',
  entry: {
    index: './app/index.ts',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true,
      }),
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
})

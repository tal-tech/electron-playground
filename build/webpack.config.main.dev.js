const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

module.exports = merge.smart(baseConfig, {
  mode: 'development',
  target: 'electron-main',
  entry: {
    index: './app/index.ts',
  },
  optimization:{
    namedModules: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],
})

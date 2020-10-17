const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'

module.exports = merge.smart(baseConfig, {
  mode: env,
  target: 'electron-preload',
  entry: {
    preload: './app/preload/index.ts',
    communication1: './app/preload/demo-communication.ts',
    communication2: './app/preload/demo-communication2.ts',
    windowType: './app/preload/demo-window-type.ts',
    fullScreen: './app/preload/demo-full-screen.ts',
  },
  devtool: env === 'development' ? 'source-map' : false,
  optimization: {
    namedModules: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
})

// 对渲染进程的一些限制和预加载脚本
/**
 * 这里存放BrowserWindow创建的基本webPreferences配置。也包括一些特殊页面的扩展配置，特殊页面的扩展配置都是基
 * 于BaseOption。
 */

import path from 'path'
import { PRELOAD_FILE } from 'app/config'

export const BaseWebPreferences: Electron.BrowserWindowConstructorOptions['webPreferences'] = {
  // // 集成node
  nodeIntegration: true,
  // // 禁用同源策略
  webSecurity: false,
  // 预加载脚本 通过绝对地址注入
  preload: path.resolve(__dirname, PRELOAD_FILE),
  enableRemoteModule: true
}

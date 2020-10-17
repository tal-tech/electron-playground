const path = require('path')
const { BrowserWindow } = require('electron')

const BaseWebPreferences = {
  nodeIntegration: true,
  preload: path.resolve(__dirname, './windowType.js'),
}

// 主窗口代码
const win = new BrowserWindow({ webPreferences: BaseWebPreferences, frame: false })
win.loadURL('https://github.com')


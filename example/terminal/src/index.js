const { app, BrowserWindow } = require('electron')
const processMessage = require('./processMessage')

// 创建窗口
function createWindow() {
  // 创建窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 页面直接使用node的能力 用于引入node模块 执行命令
    },
  })
  debugger
  // 加载本地页面
  win.loadFile('./src/index.html')
  win.webContents.openDevTools() // 打开控制台
  // 主线程和渲染进程通信 
  const ProcessMessage = new processMessage(win)
  ProcessMessage.init()
}

// app ready 创建窗口
app.whenReady().then(createWindow)

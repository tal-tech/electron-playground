const { ipcMain } = require('electron')
class ProcessMessage {
  /**
   * 进程通信
   * @param {*} win 创建的窗口
   */
  constructor(win) {
    this.win = win
  }
  init() {
    this.watch()
    this.on()
  }
  // 监听渲染进程事件通信
  watch() {
    // 页面准备好了
    ipcMain.on('page-ready', () => {
      this.sendFocus()
    })
  }
  // 监听窗口、app、等模块的事件
  on() {
    // 监听窗口是否聚焦
    this.win.on('focus', () => {
      this.sendFocus(true)
    })
    this.win.on('blur', () => {
      this.sendFocus(false)
    })
  }
  /**
   * 窗口聚焦事件发送
   * @param {*} isActive 是否聚焦
   */
  sendFocus(isActive) {
    // 主线程发送事件给窗口
    this.win.webContents.send('win-focus', isActive)
  }
}

module.exports = ProcessMessage

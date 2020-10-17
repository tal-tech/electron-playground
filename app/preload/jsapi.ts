import { ipcRenderer, BrowserWindowConstructorOptions } from 'electron'

// 执行electron代码
function actionCode(fnStr: string) {
  const result = ipcRenderer.sendSync('ACTION_CODE', fnStr)
  return result
}

// 打开新的窗口
function openWindow(url: string, options: BrowserWindowConstructorOptions) {
  const result = ipcRenderer.send('OPEN_WINDOW', { url, options })
  return result
}

export function initJSAPI() {
  window.$EB = {
    ipcRenderer,
    actionCode,
    openWindow,
    crash: process.crash,
  }
}

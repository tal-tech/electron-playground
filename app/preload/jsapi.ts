import { WindowName } from 'app/browser-window'
import { ipcRenderer, BrowserWindowConstructorOptions } from 'electron'

// 执行electron代码
function actionCode(fnStr: string) {
  const result = ipcRenderer.sendSync('ACTION_CODE', fnStr)
  return result
}

// 打开新的窗口
function openWindow(name: WindowName) {
  const result = ipcRenderer.send('OPEN_WINDOW', { name })
  return result
}

function closeWindow(name?: WindowName) {
  const result = ipcRenderer.send('CLOSE_WINDOW', name)
  return result
}

function maximizeWindow(name?: WindowName) {
  const result = ipcRenderer.send('MAXIMIZE_WINDOW', name)
  return result
}

function minimizeWindow(name?: WindowName) {
  const result = ipcRenderer.send('MINIMIZE_WINDOW', name)
  return result
}

export function initJSAPI() {
  window.$EB = {
    ipcRenderer,
    actionCode,
    openWindow,
    closeWindow,
    maximizeWindow,
    minimizeWindow,
    crash: process.crash,
  }
}

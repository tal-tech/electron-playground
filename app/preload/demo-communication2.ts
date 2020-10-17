/* eslint-disable */
import { remote, ipcRenderer } from 'electron'

// 父窗口监听子窗口事件
ipcRenderer.on('communication-to-parent', (event, msg) => {
  alert(msg)
})

const parentWindow = remote.getCurrentWindow().getParentWindow()
// @ts-ignore
window.sendToParent = (params: any) =>
  parentWindow.webContents.send('communication-to-parent', params)

/**
 * 这个是用于窗口通信例子的preload，
 * preload执行顺序在窗口js执行顺序之前
 */
/* eslint-disable */
import { ipcRenderer, remote } from 'electron'
const { argv } = require('yargs')

const { BrowserWindow } = remote

// 父窗口监听子窗口事件
ipcRenderer.on('communication-to-parent', (event, msg) => {
  alert(msg)
})

const { parentWindowId } = argv
if (parentWindowId !== 'undefined') {
  const parentWindow = BrowserWindow.fromId(parentWindowId as number)
  // 挂载到window
  // @ts-ignore
  window.send = (params: any) => {
    parentWindow.webContents.send('communication-to-parent', params)
  }
}

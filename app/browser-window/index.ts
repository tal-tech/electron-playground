import logger from 'app/collect/logger'
import { messageBox } from 'app/dialog'
import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { createDownloadManagerWindow } from 'app/browser-window/windows/download-manager-window'
import { createApiWindow } from './windows/api-window'
import { createEditorWindow } from './windows/editor-window'
import { createStartWindow } from './windows/start-window'

export interface OpenWindowOptions {
  name: WindowName
}

// types declaration
export type WindowName = 'api' | 'editor' | 'start' | 'download-manager'
export type CreateWindowOptions = {}
export type CreateWindowHandler = (options?: CreateWindowOptions) => BrowserWindow

// handlers for creating window
const HandlersMap: { [key in WindowName]: CreateWindowHandler } = {
  api: createApiWindow,
  editor: createEditorWindow,
  start: createStartWindow,
  'download-manager': createDownloadManagerWindow,
}
Object.freeze(HandlersMap)
let CLOSE_WINDOW = false

// browserWindow store
const WindowMap = new Map<WindowName, BrowserWindow>()

function hackFakeCloseMainWindow(win: BrowserWindow) {
  win.on('close', event => {
    if (CLOSE_WINDOW) return
    event.preventDefault()
    if (win.isFullScreen()) {
      win.setFullScreen(false)
    } else {
      win.hide()
    }
  })
}

// create window by name
export function createWindow(name: WindowName, options?: CreateWindowOptions): BrowserWindow {
  const handler = HandlersMap[name]
  if (typeof handler !== 'function') {
    throw new Error(`no handler for ${name}!`)
  }

  const win = handler(options)
  WindowMap.set(name, win)

  // listener for all window
  win.on('closed', () => WindowMap.delete(name))

  // listener for all webcontents
  win.webContents.on('render-process-gone', async (event, details) => {
    console.log(event, details)
    messageBox.error({
      message: `The renderer process gone. ${details.reason}`,
      buttons: ['quit', 'relaunch'],
    })
  })
  win.webContents.on('console-message', (e: Event, level: number, message: string) => {
    const arr = ['debug', 'log', 'warn', 'error'] as const
    logger[arr[level] || 'log'](message)
  })

  hackFakeCloseMainWindow(win)
  return win
}

export function getMainWindow() {
  return WindowMap.get('start') || WindowMap.get('api') || WindowMap.get('editor')
}

export function restoreMainWindow() {
  const win = WindowMap.get('start') || WindowMap.get('api') || WindowMap.get('editor')
  win?.restore()
  win?.show()
}

export function closeMainWindow() {
  CLOSE_WINDOW = true
  for (const win of WindowMap) {
    win[1].close()
  }
  CLOSE_WINDOW = false
}

;(async () => {
  await app.whenReady()
  ipcMain.on('OPEN_WINDOW', (event: IpcMainEvent, optionsProps: OpenWindowOptions) => {
    const { name } = optionsProps
    createWindow(name)

    event.returnValue = 1
  })

  ipcMain.on('CLOSE_WINDOW', (e, options) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    win?.close()
  })

  ipcMain.on('MAXIMIZE_WINDOW', (e, options) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    console.log(win?.isMaximized())
    win?.isMaximized() ? win?.unmaximize() : win?.maximize()
  })

  ipcMain.on('MINIMIZE_WINDOW', (e, options) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    win?.isMinimized() ? win?.restore() : win?.minimize()
  })
})()

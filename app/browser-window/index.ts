import logger from 'app/collect/logger'
import { messageBox } from 'app/dialog'
import { BrowserWindow } from 'electron'
import { createApiWindow } from './windows/api-window'
import { createEditorWindow } from './windows/editor-window'
import { createStartWindow } from './windows/start-window'

// types declaration
export type WindowName = 'api' | 'editor' | 'start'
export type CreateWindowOptions = { }
export type CreateWindowHandler = (options?: CreateWindowOptions) => BrowserWindow

// handlers for creating window
const HandlersMap: {[key in WindowName]: CreateWindowHandler} = {
  api: createApiWindow,
  editor: createEditorWindow,
  start: createStartWindow,
}
Object.freeze(HandlersMap)

// browserWindow store
const WindowMap = new Map<WindowName, BrowserWindow>()

// create window by name
export function createWindow(name: WindowName, options?: CreateWindowOptions): BrowserWindow {

  const handler = HandlersMap[name]
  if(typeof handler !== 'function'){
    throw new Error(`no handler for ${name}!`)
  }

  const win = handler(options)
  WindowMap.set(name, win)

  // listener for all window
  win.on('closed', () => WindowMap.delete(name))

  // listener for all webcontents
  win.webContents.on('render-process-gone', async(event, details)=>{
    console.log(event, details)
    messageBox.error({
      message: `The renderer process gone. ${details.reason}`,
      buttons: ['quit', 'relaunch'],
    })
  })
  win.webContents.on('console-message', (e: Event, level: number,message:string) => {
    const arr = ['debug', 'log', 'warn', 'error'] as const
    logger[arr[level] || 'log'](message)
  })
  
  return win
}
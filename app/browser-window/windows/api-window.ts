import { PLAYGROUND_FILE_URL, PRELOAD_FILE } from 'app/config'
import { registerFileManagerService } from 'app/file-manager'
import { BrowserWindow, shell } from 'electron'
import { CreateWindowHandler } from '..'

const OPTIONS: Electron.BrowserWindowConstructorOptions = {
  width: 1280,
  height: 900,
  minWidth: 960,
  minHeight: 640,
  titleBarStyle: 'hidden',
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false,
    preload: PRELOAD_FILE,
    enableRemoteModule: true,
  }
}

const URL = `${PLAYGROUND_FILE_URL}#/apidoc`

export const createApiWindow: CreateWindowHandler = () => {
  const win = new BrowserWindow(OPTIONS)
  win.loadURL(URL)

  win.webContents.on('will-navigate', (event, url) => {
    if (/^http(s)?:/.test(url)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  registerFileManagerService(win)

  return win
}

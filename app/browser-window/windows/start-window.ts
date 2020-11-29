import { PLAYGROUND_FILE_URL, PRELOAD_FILE } from 'app/config'
import { BrowserWindow } from 'electron'
import { CreateWindowHandler } from '..'

const OPTIONS: Electron.BrowserWindowConstructorOptions = {
  width: 600,
  height: 640,
  resizable: false,
  titleBarStyle: 'hidden',
  autoHideMenuBar: true,
  frame: false,
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false,
    preload: PRELOAD_FILE,
    enableRemoteModule: true,
  },
}

const URL = `${PLAYGROUND_FILE_URL}#start`

export const createStartWindow: CreateWindowHandler = () => {
  const win = new BrowserWindow(OPTIONS)
  win.loadURL(URL)

  return win
}

import { PLAYGROUND_FILE_URL, PRELOAD_FILE } from 'app/config'
import { registerFileManagerService } from 'app/file-manager'
import { BrowserWindow, shell } from 'electron'
import { CreateWindowHandler } from '..'

const OPTIONS: Electron.BrowserWindowConstructorOptions = {
  title: '下载管理器',
  width: 600,
  height: 400,
  titleBarStyle: 'hidden',
  maximizable: false,
  show: false,
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false,
    preload: PRELOAD_FILE,
    enableRemoteModule: true,
  }
}

const URL = `${PLAYGROUND_FILE_URL}#/download-manager/demo`

export const createDownloadManagerWindow: CreateWindowHandler = () => {
  const win = new BrowserWindow(OPTIONS)
  win.loadURL(URL)

  win.webContents.on('will-navigate', (event, url) => {
    if (/^http(s)?:/.test(url)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  return win
}

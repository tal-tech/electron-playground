import { PLAYGROUND_FILE_URL, PRELOAD_FILE } from 'app/config'
import path from 'path'
import { WindowCenter } from '../window-center'

const url = path.join(PLAYGROUND_FILE_URL, '#', 'start') 

export function createStartWindow() {
  const win = WindowCenter.create('start', {
    width: 600,
    height: 424,
    center: true,
    webPreferences:{
      preload: PRELOAD_FILE,
    },
  })

  win.loadURL(url)
}
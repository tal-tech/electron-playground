import path from 'path'
import url from 'url'

import { machineIdSync } from 'node-machine-id'

let machineId = ''
export const getMachineId = () => {
  if (machineId) {
    return machineId
  }
  try {
    machineId = machineIdSync()
  } catch (err) {
    console.error('Machine ID retrieval failed:', err)
  }
  return machineId
}


// 注入渲染进程窗口的地址
export const PLAYGROUND_FILE_URL = url.format({
  protocol: 'file:',
  pathname: path.resolve(__dirname, '..', '..', 'dist', 'playground', 'index.html'),
  slashes: true,
})

export const PRELOAD_FILE = path.resolve(__dirname, 'preload.js')

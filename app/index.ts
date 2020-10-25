/* eslint-disable */
import { app } from 'electron'
import 'app/collect/sentry'

import { getOrCreateMainWindow, restoreMainWindow, closeMainWindow } from 'app/browser-window'
import { startUpdaterSchedule } from 'app/updater'
import { addCodeRunnerListener } from 'app/event/code-runner'
import ProtocolService from 'app/protocol'
import { setUpTray } from './tray'
import { addDevToolsExtensionAtDevelopmentMode } from './browser-window/add-extensions'
import { registerFileManagerService } from './file-manager'


function run() {
  // https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock
  // 请求单例锁，避免打开多个electron实例
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
    return
  }
  ProtocolService.setDefaultProtocol()
  // 如果有第二个实例 将重启应用
  app.on('second-instance', () => {
    restoreMainWindow()
  })

  app.on('ready', () => {
    ProtocolService.registerStringProtocol()
    addDevToolsExtensionAtDevelopmentMode()

    const win = getOrCreateMainWindow()

    setUpTray()
    registerFileManagerService(win)
  })

  app.allowRendererProcessReuse = false

  app.on('will-finish-launching', () => {
    ProtocolService.watchMacProtocol()
    startUpdaterSchedule() // 五小时检测一次更新
    addCodeRunnerListener() // 监听渲染进程的code-runner
  })
  ProtocolService.watchWindowProtocol()

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('before-quit', () => {
    closeMainWindow()
  })

  app.on('activate', () => {
    restoreMainWindow()
  })
}

run()

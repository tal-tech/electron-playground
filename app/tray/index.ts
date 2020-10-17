import { Tray, Menu, app, nativeTheme } from 'electron'
import path from 'path'
import { restoreMainWindow } from 'app/browser-window'

let tray: Tray
// 设置顶部APP图标的操作和图标
export function setUpTray() {
  const lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')
  const darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png')

  tray = new Tray(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开Playground',
      click: () => {
        restoreMainWindow()
      },
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  ])
  tray.setToolTip('Electron-Playground')
  tray.setContextMenu(contextMenu)

  nativeTheme.on('updated', () => {
    tray.setImage(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)
  })

  // windows下双击托盘图标打开app
  tray.on('double-click', () => {
    restoreMainWindow()
  })
}

export function destroyTray() {
  tray.destroy()
}
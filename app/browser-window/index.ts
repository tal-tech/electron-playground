import { BrowserWindow, shell } from 'electron'
import { setupMenu } from 'app/menu'
import logger from 'app/collect/logger'
import { addCrashListener } from 'app/collect/sentry'
import { BaseOptions, WindowOptionType, PlaygroundOption } from './options'
import { BaseWebPreferences } from './web-preferences'
import { PLAYGROUND_FILE_URL } from '../config'

const BrowserWindowsMap = new Map<number, BrowserWindow>()
let mainWindowId: number // 主窗口 任何时候都可以拿到

function __createBrowserWindow(
  url: string,
  options: WindowOptionType = BaseOptions,
  webPreferences: Electron.BrowserWindowConstructorOptions['webPreferences'] = BaseWebPreferences,
) {
  // 尽管有类型检查，还是要在运行时拦截掉webPreferences相关的配置
  const finalOptions: Electron.BrowserWindowConstructorOptions = {
    ...options,
    webPreferences: {
      ...webPreferences,
    }, // 渲染进程网页功能设置
  }

  const browserWindow = new BrowserWindow(finalOptions)
  browserWindow.webContents.send('current_window_id', browserWindow.id)

  browserWindow.loadURL(url)

  return browserWindow
}

export function createBrowserWindow(url: string, options: WindowOptionType = {}) {
  const loadUrl = PLAYGROUND_FILE_URL

  const browserWindow = __createBrowserWindow(
    loadUrl,
    { ...PlaygroundOption, ...options },
    undefined,
  )
  // 监听崩溃
  addCrashListener(browserWindow)

  if (!mainWindowId) {
    mainWindowId = browserWindow.id
  }

  // 开发模式下自动打开控制台
  browserWindow.on('ready-to-show', () => {
    browserWindow.show()
    // if (process.env.NODE_ENV === 'development') {
    // browserWindow.webContents.openDevTools()
    // }
  })

  browserWindow.on('close', event => {
    if (browserWindow.id === mainWindowId) {
      event.preventDefault()
      browserWindow.hide()
    }
  })

  BrowserWindowsMap.set(browserWindow.id, browserWindow)

  // 主窗口导航拦截
  browserWindow.webContents.on('will-navigate', (event, url) => {
    if (browserWindow.id !== mainWindowId) {
      return
    }
    if (/^http(s)?:/.test(url)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
  browserWindow.webContents.once('dom-ready', () => {
    if (browserWindow) {
      setupMenu()
    }
  })
  // 接收到webcontents中的console后，在主进程中输出到文件
  browserWindow.webContents.on(
    'console-message',
    (event: Event, level: number, message: string) => {
      const arr = ['debug', 'log', 'warn', 'error'] as const
      const method = arr[level] || 'log'
      logger[method](message)
    },
  )
  return browserWindow
}

// 恢复主窗口显示
export function restoreMainWindow() {
  const mainWindow = BrowserWindowsMap.get(mainWindowId)
  if (mainWindow) {
    mainWindow.restore()
    // windows下如果hide之后不调用show方法而是只调用restore方法就会导致页面挂住不能用
    mainWindow.show()
  }
}

// 强制关闭主窗口
export function closeMainWindow() {
  const mainWindow = BrowserWindowsMap.get(mainWindowId)
  if (mainWindow) {
    mainWindowId = -1
    mainWindow.close()
  }
}

export function getOrCreateMainWindow(
  url?: string,
  options?: WindowOptionType,
): Electron.BrowserWindow {
  // 获取当前聚焦的窗口，如果没有用第一个，如果还是没有，则创建一个新的窗口
  return (
    BrowserWindow.getFocusedWindow() ||
    BrowserWindowsMap.values().next().value ||
    createBrowserWindow(url as string, options)
  )
}

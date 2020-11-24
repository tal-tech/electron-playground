import { BrowserWindow } from 'electron'

export type WindowType = 'start' | 'api' | 'playground'

export class WindowCenter{

  private static map: Map<WindowType, BrowserWindow> = new Map()

  static create(name: WindowType, options: Electron.BrowserWindowConstructorOptions) {
    const win = new BrowserWindow(options)
    WindowCenter.map.set(name, win)

    return win
  }

  static getWindow(name: WindowType) {
    return WindowCenter.map.get(name)
  }
}

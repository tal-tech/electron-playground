/* eslint-disable no-new-func */
/* eslint-disable no-var */

import { createWindow, WindowName } from 'app/browser-window'
import { PLAYGROUND_FILE_URL } from 'app/config'
import { IpcMainEvent, ipcMain, BrowserWindowConstructorOptions, BrowserWindow } from 'electron'
import util from 'util'

// require会被webpack代理，要使用原生的require需要做判断
declare var __webpack_require__: Function
declare var __non_webpack_require__: Function
const nativeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

type LogType = 'log' | 'error' | 'warn' | 'info' | 'debug'
export interface LogItem {
  type: LogType
  content: string
}

// 拦截运行时的log
class MockConsole {
  private _logs: { type: LogType; content: string }[] = []

  private createConsole(type: LogType) {
    return (...args: unknown[]) => {
      if (!args.length) {
        return
      }
      try {
        console.log('args', args)

        const content = args.reduce(
          (prev, curr) => prev + util.inspect(curr, { showHidden: true }),
          '',
        ) as string
        console.log('content', content)
        this._logs.push({ type, content })
      } catch (error) {
        console.error(error)
      }
    }
  }

  public get logs() {
    return this._logs
  }

  public log = this.createConsole('log')

  public error = this.createConsole('error')

  public warn = this.createConsole('warn')

  public info = this.createConsole('info')

  public debug = this.createConsole('debug')
}

// 在主进程执行electron的代码
export function addCodeRunnerListener() {
  ipcMain.on('ACTION_CODE', (event: IpcMainEvent, fnStr: string) => {
    try {
      const mockConsole = new MockConsole()
      const fn = new Function(
        'exports',
        'require',
        'module',
        '__filename',
        '__dirname',
        'console',
        `return function(){
              try{
                ${fnStr}
              }catch(error){
                console.error('程序执行错误',error)
              }
             }`,
      )(exports, nativeRequire, module, __filename, __dirname, mockConsole)
      const result = fn()
      if (result) {
        mockConsole.log(result)
      }
      event.returnValue = mockConsole.logs
    } catch (err) {
      console.log('执行动态代码错误', err)
    }
  })
}

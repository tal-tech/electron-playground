import fs from 'fs'
import path from 'path'

declare global {
  interface Window {
    $EB: any
    fs: typeof fs
    path: typeof path
  }
  namespace NodeJS {
    interface Global {
      __native_console_log__: typeof console.log
      __native_console_error__: typeof console.error
      __native_console_warn__: typeof console.warn
      __native_console_info__: typeof console.info

      __dirname: string
      title: string
      mainId: number
      hasAutoUpdateClicked: boolean
    }
  }
}

export {}

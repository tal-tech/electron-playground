import { dialog, BrowserWindow } from 'electron'

function createMessageBoxShow(type: NonNullable<Electron.MessageBoxOptions['type']>) {
  // 这里将window参数反置，因为一般情况下其实不会用到window参数，这里参考了vscode的做法
  return function dialogShowMessageBox(
    options: Omit<Electron.MessageBoxOptions, 'type'>,
    window?: BrowserWindow
  ) {
    if (window) {
      return dialog.showMessageBox(window, { type, ...options })
    }
    return dialog.showMessageBox({ type, ...options })
  }
}

// 将不同类型的messageBox封装成不同方法，简化调用，有点儿类似antd的message、toast等
export const messageBox = {
  none: createMessageBoxShow('none'),
  info: createMessageBoxShow('info'),
  error: createMessageBoxShow('error'),
  question: createMessageBoxShow('question'),
  warning: createMessageBoxShow('warning')
}

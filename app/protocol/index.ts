// 自定义协议
import { app, protocol } from 'electron'
import path from 'path'
import { messageBox } from 'app/dialog'

const PROTOCOL_URL = 'electron-playground' 

// 自定义协议的链接 正则
const DEFAULT_PROTOCOL_REGEXP = new RegExp(`^${PROTOCOL_URL}://`)

// 设置自定义协议
function setDefaultProtocol() {
  // 每次运行删除 这样就可以重新注册了
  app.removeAsDefaultProtocolClient(PROTOCOL_URL)
  // 开发模式下在window运行需要做兼容
  if (process.env.NODE_ENV === 'development' && process.platform === 'win32') {
    // 设置electron.exe 和 app的路径
    app.setAsDefaultProtocolClient(PROTOCOL_URL, process.execPath, [
      path.resolve(process.argv[1]),
    ])
  } else {
    app.setAsDefaultProtocolClient(PROTOCOL_URL)
  }
}

// 监听mac下自定义协议打开
function watchMacProtocol() {
  // mac会激活open-url事件
  app.on('open-url', (event, url) => {
    // electron-playground://asdsadsaddsfd
    const isProtocol = DEFAULT_PROTOCOL_REGEXP.test(url)
    if (isProtocol) {
      messageBox.info({
        message: 'Mac protocol 自定义协议打开',
        detail: `链接:${url}`,
      })
    }
  })
}

// 监听window下 自定义协议打开
function watchWindowProtocol() {
  app.on('second-instance', (event, commandLine) => {
    commandLine.forEach(str => {
      if (DEFAULT_PROTOCOL_REGEXP.test(str)) {
        messageBox.info({
          message: 'window protocol 自定义协议打开',
          detail: `链接:${str}`,
        })
      }
    })
  })
}

const myScheme = 'myscheme'

// 需要再ready事件前调用, 并且只调用一次
protocol.registerSchemesAsPrivileged([
  { scheme: myScheme, privileges: { bypassCSP: true } },
])

// 请求文件自定义协议拦截 重新设置请求链接
function registerStringProtocol() {
  protocol.registerFileProtocol(
    myScheme,
    (request, callback) => {
      // 重新拼接文件资源路径
      const resolvePath = path.resolve(__dirname, '../../playground')
      let url = request.url.replace( `${myScheme}://`, '' )
      url = `${resolvePath}/${url}`
      return callback({ path: decodeURIComponent(url) })
    },
  )
}

export default {
  setDefaultProtocol,
  watchMacProtocol,
  watchWindowProtocol,
  registerStringProtocol,
}

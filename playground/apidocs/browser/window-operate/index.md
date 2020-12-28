# 1. 创建和管理窗口

通过`electron`的`BrowserWindow`模块，我们可以轻松 __创建__ 和 __管理__ 窗口。


在浏览器打开 [完整的API文档](https://www.electronjs.org/docs/api/browser-window)


每个应用，因为业务的不同；创建和管理窗口的方式和流程也大不相同；这里我们以下流程为例：

<img src="../../resources/markdown/window-create.png" alt="window create">


## 1.1. 创建窗口

通过`BrowserWindow`，来 __创建__ 或者 __管理__ 新的浏览器窗口，每个浏览器窗口都有一个进程来管理。

这里，我们把 __创建__ 和 __管理__，分为 __用户行为__ 和 __应用本身__。


__应用本身__ 即是：应用启动 ——> 窗口创建 --> 窗口展示   
__用户行为__ 即是：窗口已经创建完毕，用户点击`a`链接而创建的窗口的行为

### 1.1.1. 简单创建一个窗口
```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: false, height:'100px' }
const { BrowserWindow } = require('electron');
const win = new BrowserWindow();
win.loadURL('https://github.com');
```

### 1.1.2. 优化
__问题__：`electron`的`BrowserWindow`模块在创建时，如果没有配置`show:false`，在创建之时就会显示出来，且默认的背景是白色；然后窗口请求`HTML`，会出现闪烁。   

[完整api文档](https://www.electronjs.org/docs/api/browser-window#%E4%BD%BF%E7%94%A8ready-to-show%E4%BA%8B%E4%BB%B6)

__解决__
```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: true, height:'200px' }
const { BrowserWindow } = require('electron');
const win = new BrowserWindow({ show:false,x:100,y:100 });

win.loadURL('https://github.com');

win.on('ready-to-show',()=>{
    win.show();
})
```
__对比上面简单创建窗口__，可以明显看出2者的区别

`new BrowserWindow(options)`，[options配置文档](https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions)  


## 1.2. 管理窗口

### 1.2.1. 管理应用创建的窗口

`BrowserWindow`模块在创建窗口时，会返回 __窗口实例__

在这里使用`Map`对象来存储这些 __窗口实例__

```typescript
const BrowserWindowsMap = new Map<number, BrowserWindow>()
let mainWindowId: number;

const browserWindows = new BrowserWindow({ show:false })
browserWindows.loadURL('https://github.com')
browserWindows.once('ready-to-show', () => {
  browserWindows.show()
})
BrowserWindowsMap.set(browserWindow.id, browserWindow)
mainWindowId = browserWindow.id  // 记录当前窗口为主窗口
```

> 代码中提到 __主窗口__，什么是主窗口？[主窗口隐藏和恢复](./index.html#/browser/awaken)章节

__窗口被关闭__，得把`Map`中的实例删除。

```typescript
browserWindow.on('closed', () => {
  BrowserWindowsMap?.delete(browserWindowID)
})
```
### 1.2.2. 管理用户创建的窗口
一个窗口中存在许多的链接，不管是链接跳转，或是创建新的窗口，我们都需要管理这些窗口。

__使用`new-window`监听窗口创建__
使用`new-window`可监听 __新窗口__ 的创建。浏览器打开[完整文档](https://www.electronjs.org/docs/api/web-contents#event-new-window)

核心代码如下：
```javascript
// 创建窗口监听
browserWindow.webContents.on('new-window', (event, url, frameName, disposition) => {
  /** @params {string} disposition
  *  new-window : window.open调用
  *  background-tab: command+click
  *  foreground-tab: 右键点击新标签打开或点击a标签target _blank打开
  * /
})
```
> 注：关于`disposition`字段的解释，移步[electron文档](https://www.electronjs.org/docs/api/web-contents#webcontents)、[electron源码](https://github.com/electron/electron/blob/72a089262e31054eabd342294ccdc4c414425c99/shell/browser/api/electron_api_web_contents.cc)、[chrome 源码](https://chromium.googlesource.com/chromium/src/+/66.0.3359.158/ui/base/mojo/window_open_disposition_struct_traits.h)


__扩展`new-window`__
- 可以被 当前窗口的 `new-window`事件捕捉到的

```javascript
window.open('https://github.com')
```

```html
<a href='https://github.com' target='__blank'>链接</a>
```

- 不可被 当前窗口的 `new-window`事件捕捉到的
以下api需要窗口 集成node，即 __主进程__ 创建时需配置
```javascript
const { BrowserWindow } = require('electron')
const parent = new BrowserWindow({ webPreferences:{nodeIntegration: true}});
```
__渲染进程__ 使用`BrowserWindow`创建窗口
```javascript
const { BrowserWindow } = require('electron').remote

const win = new BrowserWindow()
win.loadURL('https://github.com')
```
__应用`new-window`__
__通过 __默认浏览器__ 来打开 __第三方链接
```typescript
import { shell } from 'electron'
function openExternal(url: string) {
  const HTTP_REGEXP = /^https?:\/\//
  // 非http协议不打开，防止出现自定义协议等导致的安全问题
  if (!HTTP_REGEXP) {
    return false
  }
  try {
    await shell.openExternal(url, options)
    return true
  } catch (error) {
    console.error('open external error: ', error)
    return false
  }
}
// 创建窗口监听
browserWindow.webContents.on('new-window', (event, url, frameName, disposition) => {
  if (disposition === 'foreground-tab') {
      // 阻止鼠标点击链接
      event.preventDefault()
      openExternal(url)
  }
})
```

##  1.3. 关闭窗口
关闭窗口或者隐藏的`API`

###  1.3.1. `win.close()` 
1. 关闭页面，如果阻止`close`事件，将不会关闭页面，这会 __阻止计算机关闭__；
2. 关闭页面的服务，如`websocket`，下次打开窗口，窗口中的页面会 __重新渲染__；
3. 通过这个`API`触发的`close`事件在 `unload` 和 `beforeunload`之前触发，通过这点可以实现 __关闭时触发弹窗__；
4. 会被`closed`事件捕捉到。

__例子__：实现关闭窗口之前触发弹窗
代码如下：
```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: true, height:'100px' }
const { BrowserWindow } = require('electron');
const path = require('path');
const browserWindows = new BrowserWindow({webPreferences:{nodeIntegration: true,webSecurity: false}})
browserWindows.loadURL('file:///' + path.resolve(__dirname, '../playground/index.html#/browser/demo/window-close'))
```
注：
- 上面代码，只能应用于electron端，在web端刷新不起作用；web端无法在页面关闭或者刷新之前阻塞浏览器；
<img src="../../resources/markdown/close-window-model.png" alt="close-window-model" />
<img src="../../resources/markdown/close-window-model2.png" alt="close-window-model" />
- 阻止关闭窗口出现的弹窗，`img`元素外链`url`不起作用，会发出请求，但是不会渲染出来，可以使用`div+background`的方式；
- 关于`beforeunload`[完整`API`文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)

### 1.3.2. `win.destroy()`
1. 强制退出，无视`close`事件；
2. 关闭页面，以及页面内的服务，下次打开窗口，窗口中的页面会重新渲染；
3. 会被`closed`事件捕捉到。

### 1.3.3. `win.hide()`
> 这个隐藏窗口。

1. 隐藏窗口，会触发`hide`和`blur`事件，同样也是可以通过`event.preventDefault()`来阻止
2. 只是隐藏窗口，通过`win.show()`，可以将窗口显现，并且会保持原来的窗口，里面的服务也不会挂断


## 1.4. 其他
- 关于页面可见性，可参见[文档](https://www.electronjs.org/docs/API/browser-window#%E9%A1%B5%E9%9D%A2%E5%8F%AF%E8%A7%81%E6%80%A7)；
- __主窗口的隐藏和唤醒__ 的具体细节，可参见本章的 [主窗口隐藏和恢复](./index.html#/browser/awaken)章节；
- 窗口在被创建之后，窗口实例各种 __事件触发顺序__ 可参见 [窗口触发顺序](./index.html#/browser/window-event)章节；
- __窗口通信__，可参见 [窗口通信](./index.html#/browser/communication)章节；
- __无边框窗口__、__父子窗口__、__模态窗口__，参见[窗口类型](./index.html#/browser/window-type)章节；

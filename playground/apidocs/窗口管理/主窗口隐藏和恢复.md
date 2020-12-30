## 1. 主窗口隐藏和恢复

### 1.1. 主窗口

#### 1.1.1. 为什么需要 __主窗口__?

一个应用存在着许多的窗口，需要一个窗口作为 __主窗口__，如果该窗口关闭，则意味着整个应用被关闭。

场景：在应用只有一个页面的时，用户点击关闭按钮，不想让整个应用关闭，而是隐藏；    
例如：其他的app，像微信，QQ等桌面端。  

主进程代码示例，完整代码在本应用的`app/browser-window/index.ts`处
```javascript
let mainWindowId: number

const browserWindow = new BrowserWindow()

// 记录下主窗口id
if (!mainWindowId) {
  mainWindowId = browserWindow.id
}

browserWindow.on('close', event => {
  // 如果关闭的是主窗口，阻止
  if (browserWindow.id === mainWindowId) {
    event.preventDefault()
    browserWindow.hide()
  }
})
```
#### 1.1.2. 恢复主窗口显示
```javascript
const mainWindow = BrowserWindowsMap.get(mainWindowId)
if (mainWindow) {
  mainWindow.restore()
  // windows下如果hide之后不调用show方法而是只调用restore方法就会导致页面挂住不能用
  mainWindow.show()
}
```
#### 1.1.3. 强制关闭主窗口
```javascript
const mainWindow = BrowserWindowsMap.get(mainWindowId)
if (mainWindow) {
  mainWindowId = -1
  mainWindow.close()
}
```

### 1.2. 存在的问题
####  1.2.1. 因为阻止了close事件，导致 __关机__ 时无法关闭 __主窗口__，可以使用如下代码：
```javascript
app.on('before-quit', () => {
    closeMainWindow()
})
```
*注：`macOS` `Linux` `Windows` [完整文档](https://www.electronjs.org/docs/api/app#%E4%BA%8B%E4%BB%B6%EF%BC%9Abefore-quit)*  

####  1.2.2. 为避免启动 __多个应用__；
```javascript
app.on('second-instance', () => {
  const mainWindow = BrowserWindowsMap.get(mainWindowId)
  if (mainWindow) {
    mainWindow.restore()
    mainWindow.show()
  }
})
```
*注：`macOS` `Linux` `Windows` [完整文档](https://www.electronjs.org/docs/api/app#%E4%BA%8B%E4%BB%B6-second-instance)*  

#### 1.2.3. 首次启动应用程序、尝试在应用程序已运行时或单击 __应用程序__ 的 __坞站__ 或 __任务栏图标__ 时重新激活它；
```javascript
app.on('activate', () => {
  if (mainWindow) {
    mainWindow.restore()
    mainWindow.show()
  }
})
```
*注：`macOS` [文档](https://www.electronjs.org/docs/api/app#%E4%BA%8B%E4%BB%B6-second-instance)*


#### 1.2.4. __双击托盘图标__ 打开`app`，完整代码见`app/tray`。
```javascript
tray.on('double-click', () => {
  if (mainWindow) {
    mainWindow.restore()
    mainWindow.show()
  }
})
```

*注：`macOS`  `Windows` [文档](https://www.electronjs.org/docs/api/tray#event-double-click-macos-windows)*

### 1.3. 实例
> 你可以操作本应用的主窗口

### 1.4. 文档
如果你还是新手，或者没有开发过`electron`应用，浏览器打开 [打造你的第一个 Electron 应用
](https://www.electronjs.org/docs/tutorial/first-app#%E6%89%93%E9%80%A0%E4%BD%A0%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA-electron-%E5%BA%94%E7%94%A8)


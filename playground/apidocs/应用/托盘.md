# 托盘
## 1. 创建托盘

1. 引入Tray类
2. 获取图标地址
3. 实例化tray并传入图标地址

代码如下：

```js
// @@code-renderer: block
const { Tray } = require('electron')
const path = require('path')

const icon = path.join(__dirname, '你的图片路径')
new Tray(icon)
```

一个系统托盘就会被创建出来。很简单对不对，但是这个图标还没有任何功能，接下来我们为图标添加一些属性和事件。

## 2. 设置托盘属性

### 2.1 常用属性和事件

为tray实例设置一些属性和事件，包括上下文菜单、鼠标移入文字。详细文档[点击这里。](https://www.electronjs.org/docs/api/tray)

这里我们为tray设置灵活图标，让它可以根据系统主题显示不同的图标；再设置一个鼠标移入图标的时候会显示的提示文字，最后为它设置上下文菜单，让它可以具备一些功能。

先看下效果图：

![](img/create-tray.gif?width=600)

附上代码：

```js
// @@code-renderer: runner
// @@code-props: {height: '580px', hideRight: true}
const { Tray, Menu, nativeTheme, BrowserWindow } = require('electron')
const path = require('path')

let tray

// 设置顶部APP图标的操作和图标
const lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')
const darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png')

// 根据系统主题显示不同的主题图标
tray = new Tray(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)

tray.setToolTip('Electron-Playground')

const contextMenu = Menu.buildFromTemplate([
  {
    label: '打开新窗口',
    click: () => {
      let child = new BrowserWindow({ parent: BrowserWindow.getFocusedWindow() })
      child.loadURL('https://electronjs.org')
      child.show()
    },
  },
  {
    label: '删除图标',
    click: () => {
      tray.destroy()
    },
  },
])

tray.setContextMenu(contextMenu)
```
<br>
你可以修改提示或者菜单来试一下。这里可以设置多个托盘，实际应用中要注意设置单例锁。

我们设置了托盘根据系统主题显示不同的图标，但是系统主题是动态的，又该怎么做呢，请看：

```js
// @@code-renderer: block
nativeTheme.on('updated', () => {
  tray.setImage(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)
})
```

添加一个主题监听事件就好了。把这段代码复制到上面执行看下效果吧。

### 2.2 显示未读消息数(macOS)

在macOS系统下，可以采用setTitle(String)设置未读消息数。PS：windows下无效果。

```js
// @@code-renderer: block
tray.setTitle("1")
```

效果是这样的：

![](img/set-tray-title.png?width=400)


你也可以复制到上面代码编辑器中然后点击执行看下效果。

### 2.3 有未读消息时图标闪动(windows)

在windows系统下，可通过setImage设置正常图标与空图标切换达到闪动效果。在mac系统下空图标不占用图标空间，所以需要设置透明图标。
你可以在下面示例中用darkIcon代替nativeImage.createEmpty()然后执行看一下效果。

如何判断操作系统平台，[点击这里](http://nodejs.cn/api/process/process_platform.html)

windows下效果：

![](img/create-glimmer-tray.gif?width=600)

附代码：

```js
// @@code-renderer: runner
// @@code-props: {height: '880px', hideRight: true}
const { Tray, Menu, nativeTheme, BrowserWindow, nativeImage } = require('electron')
const path = require('path')

let tray
let timer
let toggle = true
let haveMessage = true

const lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')
const darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png')

const win = BrowserWindow.getFocusedWindow();

tray = new Tray(lightIcon)

const contextMenu = Menu.buildFromTemplate([
  {
    label: '张三的消息',
    click: () => {
      let child = new BrowserWindow({ parent: BrowserWindow.getFocusedWindow() })
      child.loadURL('https://electronjs.org')
      child.show()
    },
  },
  { type: 'separator' },
  {
    label: '删除图标',
    click: () => {
      tray.destroy()
      clearInterval(timer)
    },
  },
])

tray.setContextMenu(contextMenu)

tray.setToolTip('Electron-Playground')

if (haveMessage) {
  timer = setInterval(() => {
    toggle = !toggle
    if (toggle) {
      tray.setImage(nativeImage.createEmpty())
    } else {
      tray.setImage(lightIcon)
    }
  }, 600)
}
```

### 2.4 双击托盘显示隐藏界面(windows)

windows下效果：

![](img/create-toggle-tray.gif?width=600)

附代码：


```js
// @@code-renderer: runner
// @@code-props: {height: '260px', hideRight: true}
const { Tray, Menu, nativeTheme, BrowserWindow, nativeImage } = require('electron')
const path = require('path')

let tray

const lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')

const win = BrowserWindow.getFocusedWindow()

tray = new Tray(lightIcon)

tray.on('double-click', () => {
  win.isVisible() ? win.hide() : win.show()
})
```
注：此效果在windows上良好，在mac下会有兼容性问题，双击事件可能失效，实际使用过程中要注意。

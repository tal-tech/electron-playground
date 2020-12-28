# 菜单

## 1.简介
菜单主要分为应用程序菜单、上下文菜单，在tray和dock中也有用到菜单，本节主要介绍前两种。[文档地址](https://www.electronjs.org/docs/api/menu)
> 以下案例如有操作到应用程序菜单，可点击右下角撤回恢复正常菜单。

### 1.1 应用程序菜单
mac和windows都在左上角，但是一个在屏幕左上角一个在应用程序视图左上角。
mac是这样的：  

![](img/mac-menu.png?width=400)

windows长这样：  

![](img/win-menu.png?width=400)  

如果windows下没有显示菜单，在当前窗口按alt键即会出现。

## 2. 创建菜单
### 2.1 创建应用程序菜单

接下来我们创建应用程序菜单。如下步骤：  
1. 引入Menu类  
2. 定义一个菜单模板  
3. 调用Menu类的`buildFromTemplate`方法，该方法会根据传入的模板创建对应的菜单  
4. 调用Menu类的`setApplicationMenu`方法  

此四步即可创建应用程序菜单，先来看下效果图。

![](img/create-menu.gif?width=600)   

附上代码：<br>
```js
// @@code-renderer: runner
// @@code-props: { height: '570px', hideRight: true }
const { Menu, dialog, app } = require('electron')

const template = [
  {
    label: 'app', // macOS下第一个标签是应用程序名字，此处设置无效
    submenu: [
      { label: '退出', click: () => { app.quit() } },
      { label: '关于', click: () => { app.showAboutPanel() } }
    ]
  },
  {
    label: '文件',
    submenu: [
      {
        label: '子菜单', 
        click: () => {
          // 调用了dialog（弹窗模块），演示效果
          dialog.showMessageBoxSync({
            type: 'info',
            title: '提示',
            message: '点击了子菜单'
          })
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)
```
<br>
点击执行后看左上菜单效果。  

   
### 2.2 创建上下文菜单
即创建右键点击菜单，前三步与创建应用程序菜单相同，最后一步需监听窗口`context-menu`事件展示菜单选项。
监听事件[context-menu文档](https://www.electronjs.org/docs/api/web-contents#event-context-menu)  

先上效果图。  

![](img/create-context-menu.gif?width=600)   

附上代码：<br>

```js
// @@code-renderer: runner
// @@code-props: {height: '460px', hideRight: true}
const { Menu, BrowserWindow } = require('electron')

const menu = new Menu();

const template = [
  {
    label: 'app', // macOS下第一个标签是应用程序名字，此处设置无效
    submenu: [
      { role: 'quit' },
      { role: 'about' }
    ]
  },
  {
    label: '编辑',
    role: 'editMenu'
  }
]

const contextMenu = Menu.buildFromTemplate(template)

// 主进程，渲染进程可使用window.addEventListener设置监听事件
BrowserWindow.getFocusedWindow().webContents.on('context-menu', () => {
  contextMenu.popup()
})
```
<br>

可能你已经发现，这个例子的代码比上个例子少，实现的菜单却更多，而且这个`role`又是干嘛的呢，别急，往下看。

## 3. 设置菜单属性
  
上节说到，这个`role`是干嘛的呢？
其实创建菜单行为有两种方式，一种是自定义，即1.1中实现方式，另外一种是预定义即`role`。  

role是MenuItem的属性，是electron的预定义行为。[文档](https://www.electronjs.org/docs/api/menu-item#%E8%A7%92%E8%89%B2)说：最好给任何一个菜单指定 role去匹配一个标准角色, 而不是尝试在 click 函数中手动实现该行为。 内置的 role 行为将提供最佳的原生体验。使用 role 时, label 和 accelerator 值是可选的, 并为每个平台，将默认为适当值。

这就是说，你只要设置好role属性，那么这个菜单的文案、快捷键、事件行为都已内部实现，而且比自定义的行为体验更好。

```js
// @@code-renderer: runner
// @@code-props: {height: '500px', hideRight: true}
const { Menu, BrowserWindow } = require('electron')

const templateCustom = [
  {
    label: 'app', // macOS下第一个标签是应用程序名字，此处设置无效
    submenu: [
      { label: 'quit', role: 'quit' },
      {label: '关于', role: 'about', accelerator: 'CommandOrControl + shift + H' }
    ]
  },
  {
    label: '编辑',
    submenu: [
      {role: 'editMenu'},
      {type: 'separator'},
      {label: '自定义', click: () => {
        const win = new BrowserWindow()
        win.loadURL('https://electronjs.org')
      } }
    ]
  }
]

const customMenu = Menu.buildFromTemplate(templateCustom)

Menu.setApplicationMenu(customMenu)
```  
<br>

line8的`accelerator`相信你看一眼就知道是设置快捷键的属性，你也可以自己更改快捷键点击执行试一下。

## 4. 隐藏菜单

如果我们在开发中使用了一些菜单，但是不想让用户看到，还要在线上保留这个功能，比如调试窗口，方便线上查找bug，那么这个隐藏菜单的属性visible就可以派上用场了。

看下效果图：  

![](img/hide-menu.gif?width=600)   

```js
// @@code-renderer: runner
// @@code-props: {height: '120px', hideRight: true}
const { Menu } = require('electron')
const menu = Menu.getApplicationMenu()

menu.items[3].submenu.items[2].visible = false;
```  

<br>

> 如果点击试一试报错，先点击右下角撤回再重试一下哦！  

如图所示：刚开始可以看到view的子菜单Toggle Developer Tools切换调试窗口，点击执行隐藏该菜单，这时通过快捷键cmd+option+I(windows下ctrl+shift+I)切换调试窗口。
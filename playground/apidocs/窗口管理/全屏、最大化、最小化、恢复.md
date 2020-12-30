# 1. 全屏、最大化、最小化、恢复

## 1.1. 全屏

### 1.1.1. 创建时进入全屏
> 配置`new BrowserWindow({ fullscreen:true })`  

```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: true, height:'100px' }
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ fullscreen:true,fullscreenable:true })
win.loadURL('https://github.com')
```

### 1.1.2. 使用`API`进入全屏

> 确保当前窗口的`fullscreenable:true`，以下`API`才能使用

1. `win.setFullScreen(flag)`，设置全屏状态；
2. `win.setSimpleFullScreen(flag)`，`macOS`下独有，设置简单全屏。

### 1.1.3. 全屏状态的获取

1. `win.fullScreen`，来判断当前窗口是否全屏；
2. `win.isFullScreen()`，`macOS`独有；
3. `win.isSimpleFullScreen()`，`macOS`独有。

### 1.1.4. 全屏事件的监听

1. `rezise` 调整窗口大小后触发;
2. `enter-full-screen` 窗口进入全屏状态时触发;
3. `leave-full-screen` 窗口离开全屏状态时触发;
4. `enter-html-full-screen` 窗口进入由HTML API 触发的全屏状态时触发;
5. `leave-html-full-screen` 窗口离开由HTML API触发的全屏状态时触发。


### 1.1.5. `HTML` `API`无法和窗口联动
__试一试__

```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: true, height:'200px' }
const path = require('path')
const { BrowserWindow } = require('electron')
const BaseWebPreferences = { 
    nodeIntegration: true,
    preload: path.resolve(__dirname, './fullScreen.js'), 
};
const win = new BrowserWindow({ webPreferences: BaseWebPreferences })
win.loadURL('file:///' + path.resolve(__dirname, '../playground/index.html#/demo/full-screen'))
```
> 使用按钮全屏和退出全屏是可以的，但是先点击左上角🚥全屏，再使用按钮退出全屏，是不行的。因为无法知道当前的状态是全屏，还是不是全屏。

解决办法：，将`win.setFullScreen(flag)`方法挂载到窗口的`window`上


## 1.2. 最大化、最小化
### 1.2.1. 创建窗口配置

> [完整API文档](https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions)

```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: true, height:'100px' }
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ minWidth:300,minHeight:300,maxWidth:500,maxHeight:500,width:600,height:600 })
win.loadURL('https://github.com')
```

*当使用 `minWidth/maxWidth/minHeight/maxHeight` 设置最小或最大窗口大小时, 它只限制用户。 它不会阻止您将不符合大小限制的值传递给 `setBounds/setSize` 或 `BrowserWindow` 的构造函数。*

### 1.2.2. 相关事件
| 事件名称     | 触发条件                     |
| ------------ | ---------------------------- |
| `maximize`   | 窗口最大化时触发             |
| `unmaximize` | 当窗口从最大化状态退出时触发 |
| `minimize`   | 窗口最小化时触发             |
| `restore`    | 当窗口从最小化状态恢复时触发 |

### 1.2.3. 相关状态API
1. `win.minimizable` 窗口是否可以最小化
2. `win.maximizable` 窗口是否可以最大化
3. `win.isMaximized()` 是否最大化
4. `win.isMinimized()` 是否最小化

### 1.2.4. 控制API
1. `win.maximize()` 使窗口最大化
2. `win.unmaximize()` 退出最大化
3. `win.minimize()` 使窗口最小化
4. `win.unminimize()` 退出最小化


## 1.3. 窗口恢复
`win.restore()` 将窗口从最小化状态恢复到以前的状态。
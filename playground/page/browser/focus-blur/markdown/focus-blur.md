### 1. 窗口的聚焦和失焦

#### 1.1. 聚焦

##### 1.1.1. 创建窗口时配置：
```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: true, height:'150px' }
const { BrowserWindow } = require('electron');
const win = new BrowserWindow();
win.loadURL('https://github.com')

setTimeout(()=>{
    const win2 = new BrowserWindow({x:100,y:100})
    win2.loadURL('https://www.baidu.com')
},3000)
```
`focusable:true`  窗口便可聚焦，便可以使用聚焦的`api`

`focusable:false` 在 `Windows` 中设置 `focusable: false` 也意味着设置了`skipTaskbar: true`. 在 `Linux` 中设置 `focusable: false` 时窗口停止与 `wm` 交互, 并且窗口将始终置顶。

以下讨论的情况仅为`focusable:true`情况下

```javascript
const { BrowserWindow } = require('electron');
const win = new BrowserWindow() // focusable:true 为默认配置
```

##### 1.1.2. 关于聚焦的`api`

| api                                | 功能               |
| ---------------------------------- | ------------------ |
| `BrowserWindow.getFocusedWindow()` | 来获取聚焦的窗口   |
| `win.isFocused()`                  | 判断窗口是否聚焦   |
| `win.on('focus',cb)`               | 来监听窗口是否聚焦 |
| `win.focus()`                      | 手动聚焦窗口       |

##### 1.1.3. 其他`api`副作用和聚焦有关的：

| api                  | 功能                         |
| -------------------- | ---------------------------- |
| `win.show()`         | 显示窗口，并且聚焦于窗口     |
| `win.showInactive()` | 显示窗口，但是不会聚焦于窗口 |

#### 1.2. 失焦
##### 1.2.1. 关于失焦的`api`

| api                 | 功能         |
| ------------------- | ------------ |
| `win.blur()`        | 取消窗口聚焦 |
| `win.on('blur',cb)` | 监听失焦     |

##### 1.2.2. 其他`api`副作用和失焦有关的：

| api          | 功能                         |
| ------------ | ---------------------------- |
| `win.hide()` | 隐藏窗口，并且会触发失焦事件 |

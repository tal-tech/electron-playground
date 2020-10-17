## 父子窗口
子窗口始终在父窗口之上，在 __窗口之间通信__ 章节中介绍到父子窗口之间的通信，[__窗口之间通信__](./index.html#/browser/communication)章节

```javascript
// @@code-renderer: runner
// @@code-props: { hideRight: true, height:'100px' }
const { BrowserWindow } = require('electron')

let top = new BrowserWindow()
let child = new BrowserWindow({ parent: top })
child.show()
top.show()
```
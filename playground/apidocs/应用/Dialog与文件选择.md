# 对话框

显示系统对话框, 提供了消息提示、消息提示操作以及选择文件、保存文件等操作.

## 1. 消息提示 dialog.showMessageBoxSync

### 1.1 消息提示

```js
// @@code-renderer: runner
// @@code-props: { height: '130px' }
const { dialog } = require('electron')
dialog.showMessageBoxSync({
  type: 'info',
  title: '这里是标题',
  message: '提示内容',
  detail: '额外信息'
})
```

### 1.2 消息提示与确认

```js
// @@code-renderer: runner
// @@code-props: { height: '240px' }
const { dialog } = require('electron')
const res = dialog.showMessageBoxSync({
  type: 'info',
  title: '这里是标题',
  message: '提示内容',
  detail: '额外信息',
  cancelId: 1, // 按esc默认点击索引按钮
  defaultId: 0, // 默认高亮的按钮下标
  buttons: ['确认按钮', '取消按钮'], // 按钮按索引从右往左排序
})
console.log('操作结果', res, res === 0 ? '点击确认按钮' : '点击取消按钮') // 根据按钮数组中的下标来判断
console.log('操作中还有个checkboxLabel的单选框需要使用showMessageBox api才可以获取到返回值')
```

### 1.3 API说明 

#### dialog.showMessageBoxSync(browserWindow, options)

显示一个消息框，它将阻止进程，直到消息框被关闭。返回值为点击的按钮的索引。

参数：

- `browserWindow`

  可以指定一个父窗口，作为模态窗口附加到该窗口。

- `options`

  * `type`: String (可选) - "none" ｜ "info" ｜ "error" ｜ "question" 不同的type提示的图标不同；

  * `title`: String (可选) - message box 的标题，一些平台不显示，建议使用message和detail；

  * `message`:  String - message box 的内容.

  * `detail`: String (可选) - 额外信息

  * `buttons` String[] - 字符串按钮数组，按钮按索引从右往左排序，如果未指定默认有一个"OK"的按钮。

  * `defaultId`: Integer (可选) - 默认高亮的按钮下标，回车的时候自动选中该项

  * `cancelId`: Integer (可选)  按esc默认点击索引按钮

返回值类型：

- `number`: 所点击的按钮的索引

#### dialog.showMessageBox(browserWindow, options)

与dialog.showMessageBoxSync类似，不同点在于：

1. 这是一个异步方法，返回值为Promise类型；
2. 显示的对话框可以指定一个复选框，返回值中也增加了对应的字段；

下面是带复选框的示例：
```js
// @@code-renderer: runner
// @@code-props: { height: '280px' }
const { dialog } = require('electron')
const res = dialog.showMessageBox({
  type: 'info',
  title: '这里是标题',
  message: '提示内容',
  detail: '额外信息',
  cancelId: 1, // 按esc默认点击索引按钮
  defaultId: 0, // 默认高亮的按钮下标
  checkboxLabel: '单选框内容',
  checkboxChecked: false, // 是否选中单选框
  buttons: ['确认按钮', '取消按钮'], // 按钮按索引从右往左排序
})
console.log('操作结果 promise', res) // 返回一个promise可以通过它判断结果
```

## 2. 选择文件和文件夹

### 2.1 选择文件实例

```js
// @@code-renderer: runner
// @@code-props: { height: '320px' }
const { dialog, app } = require('electron')
const res = dialog.showOpenDialogSync({
  title: '对话框窗口的标题',
  // 默认打开的路径，比如这里默认打开下载文件夹
  defaultPath: app.getPath('downloads'), 
  buttonLabel: '确认按钮文案',
  // 限制能够选择的文件类型
  filters: [
    // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    // { name: 'Custom File Type', extensions: ['as'] },
    // { name: 'All Files', extensions: ['*'] }, 
  ],
  properties: [ 'openFile', 'openDirectory', 'multiSelections', 'showHiddenFiles' ],
  message: 'mac文件选择器title'
})
console.log('res', res)
```

### API说明

`dialog.showOpenDialogSync(browserWindow,options)`

参数：

`options`

  * `defaultPath`  String (可选) - 设置对话框默认打开哪个路径，需要设置一个有效路径否则将不生效。
  * `buttonLabel`  String (可选) - 确认按钮的文案, 当为空时, 将使用默认标签
  * `filters` 默认所有文件类型都可以选择，设置后,只能选择允许的文件类型
  * `properties` String[] (可选)
  
      * `openFile` - 允许选择文件
      * `openDirectory` - 允许选择文件夹
      * `multiSelections` - 允许多选。
      * `showHiddenFiles` - 显示对话框中的隐藏文件

  
  * `message` String (可选) -  mac文件选择器的title

> tips: 尝试修改options中的参数来查看效果；

返回值类型：

`String[] | undefined` - 用户选择的文件或文件夹路径;如果取消对话框，则返回undefined

[完整API解释参考文档](https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options)

## 3. 保存文件

### 3.1 实例

```js
// @@code-renderer: runner
// @@code-props: { height: '300px' }
const { dialog } = require('electron')
const res = dialog.showSaveDialogSync({
  title: '对话框窗口的标题',
  defaultPath: '', // 打开文件选择器的哪个路径 需要输入一个有效路径
  buttonLabel: '确认按钮文案',
  // 限制能够选择的文件为某些类型
  filters: [
    // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    // { name: 'Custom File Type', extensions: ['as'] },
    // { name: 'All Files', extensions: ['*'] }, 
  ],
  nameFieldLabel: '替换文件', // “文件名”文本字段前面显示的文本自定义标签
  showsTagField: true, // 显示标签输入框，默认值为true
  properties: [ 'showHiddenFiles' ],
  message: 'mac文件选择器title'
})
console.log('res', res)
```

### 3.2 API说明

`dialog.showSaveDialogSync(browserWindow,options)`



参数：

`options`

  * `defaultPath`  String (可选) - 设置对话框默认打开哪个路径，需要设置一个有效路径否则将不生效。
  * `buttonLabel`  String (可选) - 确认按钮的文案, 当为空时, 将使用默认标签
  * `filters` 默认所有文件类型都可以选择，设置后,只能选择允许的文件类型
  * `properties` String[] (可选)
  
      * `openFile` - 允许选择文件
      * `openDirectory` - 允许选择文件夹
      * `multiSelections` - 允许多选。
      * `showHiddenFiles` - 显示对话框中的隐藏文件
      
  
  * `message` String (可选) -  mac文件选择器的title

返回值类型：

`String[] | undefined` - 用户选择的文件或文件夹路径;如果取消对话框，则返回undefined；

完整API解释参考[文档](https://www.electronjs.org/docs/api/dialog#dialogshowsavedialogsyncbrowserwindow-options)

### 3.3 不同场景表现

1. 选择了一个存在的文件 

    提示"**文件夹中已有相同名称的文件或文件夹。替换它将覆盖其当前内容。**"，点击确认后返回该文件地址

2. 选择了一个不存在的文件
   
    返回该不存在的文件地址

## 4. 错误信息弹窗

`dialog.showErrorBox`

**这个API可以在app模块触发ready事件之前被安全地调用，它通常用在启动时报告错误**。 在Linux上, ready事件之前调用这个API, 消息将被发送到stderr, 并且不会出现GUI对话框。

```js
// @@code-renderer: runner
// @@code-props: { height: '80px' }
const { dialog } = require('electron')
dialog.showErrorBox('报错标题', '报错内容')
console.log('API非常简单用于报错很方便')
```
(this["webpackJsonpelectron-playground"]=this["webpackJsonpelectron-playground"]||[]).push([[24],{1338:function(n,e,t){n.exports=["# \u6258\u76d8\n## 1. \u521b\u5efa\u6258\u76d8\n\n1. \u5f15\u5165Tray\u7c7b\n2. \u83b7\u53d6\u56fe\u6807\u5730\u5740\n3. \u5b9e\u4f8b\u5316tray\u5e76\u4f20\u5165\u56fe\u6807\u5730\u5740\n\n\u4ee3\u7801\u5982\u4e0b\uff1a\n\n```js\n// @@code-renderer: block\nconst { Tray } = require('electron')\nconst path = require('path')\n\nconst icon = path.join(__dirname, '\u4f60\u7684\u56fe\u7247\u8def\u5f84')\nnew Tray(icon)\n```\n\n\u4e00\u4e2a\u7cfb\u7edf\u6258\u76d8\u5c31\u4f1a\u88ab\u521b\u5efa\u51fa\u6765\u3002\u5f88\u7b80\u5355\u5bf9\u4e0d\u5bf9\uff0c\u4f46\u662f\u8fd9\u4e2a\u56fe\u6807\u8fd8\u6ca1\u6709\u4efb\u4f55\u529f\u80fd\uff0c\u63a5\u4e0b\u6765\u6211\u4eec\u4e3a\u56fe\u6807\u6dfb\u52a0\u4e00\u4e9b\u5c5e\u6027\u548c\u4e8b\u4ef6\u3002\n\n## 2. \u8bbe\u7f6e\u6258\u76d8\u5c5e\u6027\n\n### 2.1 \u5e38\u7528\u5c5e\u6027\u548c\u4e8b\u4ef6\n\n\u4e3atray\u5b9e\u4f8b\u8bbe\u7f6e\u4e00\u4e9b\u5c5e\u6027\u548c\u4e8b\u4ef6\uff0c\u5305\u62ec\u4e0a\u4e0b\u6587\u83dc\u5355\u3001\u9f20\u6807\u79fb\u5165\u6587\u5b57\u3002\u8be6\u7ec6\u6587\u6863[\u70b9\u51fb\u8fd9\u91cc\u3002](https://www.electronjs.org/docs/api/tray)\n\n\u8fd9\u91cc\u6211\u4eec\u4e3atray\u8bbe\u7f6e\u7075\u6d3b\u56fe\u6807\uff0c\u8ba9\u5b83\u53ef\u4ee5\u6839\u636e\u7cfb\u7edf\u4e3b\u9898\u663e\u793a\u4e0d\u540c\u7684\u56fe\u6807\uff1b\u518d\u8bbe\u7f6e\u4e00\u4e2a\u9f20\u6807\u79fb\u5165\u56fe\u6807\u7684\u65f6\u5019\u4f1a\u663e\u793a\u7684\u63d0\u793a\u6587\u5b57\uff0c\u6700\u540e\u4e3a\u5b83\u8bbe\u7f6e\u4e0a\u4e0b\u6587\u83dc\u5355\uff0c\u8ba9\u5b83\u53ef\u4ee5\u5177\u5907\u4e00\u4e9b\u529f\u80fd\u3002\n\n\u5148\u770b\u4e0b\u6548\u679c\u56fe\uff1a\n\n","![]("+t(1339)+")","\n\n\u9644\u4e0a\u4ee3\u7801\uff1a\n\n```js\n// @@code-renderer: runner\n// @@code-props: {height: '580px', hideRight: true}\nconst { Tray, Menu, nativeTheme, BrowserWindow } = require('electron')\nconst path = require('path')\n\nlet tray\n\n// \u8bbe\u7f6e\u9876\u90e8APP\u56fe\u6807\u7684\u64cd\u4f5c\u548c\u56fe\u6807\nconst lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')\nconst darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png')\n\n// \u6839\u636e\u7cfb\u7edf\u4e3b\u9898\u663e\u793a\u4e0d\u540c\u7684\u4e3b\u9898\u56fe\u6807\ntray = new Tray(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)\n\ntray.setToolTip('Electron-Playground')\n\nconst contextMenu = Menu.buildFromTemplate([\n  {\n    label: '\u6253\u5f00\u65b0\u7a97\u53e3',\n    click: () => {\n      let child = new BrowserWindow({ parent: BrowserWindow.getFocusedWindow() })\n      child.loadURL('https://electronjs.org')\n      child.show()\n    },\n  },\n  {\n    label: '\u5220\u9664\u56fe\u6807',\n    click: () => {\n      tray.destroy()\n    },\n  },\n])\n\ntray.setContextMenu(contextMenu)\n```\n<br>\n\u4f60\u53ef\u4ee5\u4fee\u6539\u63d0\u793a\u6216\u8005\u83dc\u5355\u6765\u8bd5\u4e00\u4e0b\u3002\u8fd9\u91cc\u53ef\u4ee5\u8bbe\u7f6e\u591a\u4e2a\u6258\u76d8\uff0c\u5b9e\u9645\u5e94\u7528\u4e2d\u8981\u6ce8\u610f\u8bbe\u7f6e\u5355\u4f8b\u9501\u3002\n\n\u6211\u4eec\u8bbe\u7f6e\u4e86\u6258\u76d8\u6839\u636e\u7cfb\u7edf\u4e3b\u9898\u663e\u793a\u4e0d\u540c\u7684\u56fe\u6807\uff0c\u4f46\u662f\u7cfb\u7edf\u4e3b\u9898\u662f\u52a8\u6001\u7684\uff0c\u53c8\u8be5\u600e\u4e48\u505a\u5462\uff0c\u8bf7\u770b\uff1a\n\n```js\n// @@code-renderer: block\nnativeTheme.on('updated', () => {\n  tray.setImage(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)\n})\n```\n\n\u6dfb\u52a0\u4e00\u4e2a\u4e3b\u9898\u76d1\u542c\u4e8b\u4ef6\u5c31\u597d\u4e86\u3002\u628a\u8fd9\u6bb5\u4ee3\u7801\u590d\u5236\u5230\u4e0a\u9762\u6267\u884c\u770b\u4e0b\u6548\u679c\u5427\u3002\n\n### 2.2 \u663e\u793a\u672a\u8bfb\u6d88\u606f\u6570(macOS)\n\n\u5728macOS\u7cfb\u7edf\u4e0b\uff0c\u53ef\u4ee5\u91c7\u7528setTitle(String)\u8bbe\u7f6e\u672a\u8bfb\u6d88\u606f\u6570\u3002PS\uff1awindows\u4e0b\u65e0\u6548\u679c\u3002\n\n```js\n// @@code-renderer: block\ntray.setTitle(\"1\")\n```\n\n\u6548\u679c\u662f\u8fd9\u6837\u7684\uff1a\n\n","![]("+t(1340)+")","\n\n\n\u4f60\u4e5f\u53ef\u4ee5\u590d\u5236\u5230\u4e0a\u9762\u4ee3\u7801\u7f16\u8f91\u5668\u4e2d\u7136\u540e\u70b9\u51fb\u6267\u884c\u770b\u4e0b\u6548\u679c\u3002\n\n### 2.3 \u6709\u672a\u8bfb\u6d88\u606f\u65f6\u56fe\u6807\u95ea\u52a8(windows)\n\n\u5728windows\u7cfb\u7edf\u4e0b\uff0c\u53ef\u901a\u8fc7setImage\u8bbe\u7f6e\u6b63\u5e38\u56fe\u6807\u4e0e\u7a7a\u56fe\u6807\u5207\u6362\u8fbe\u5230\u95ea\u52a8\u6548\u679c\u3002\u5728mac\u7cfb\u7edf\u4e0b\u7a7a\u56fe\u6807\u4e0d\u5360\u7528\u56fe\u6807\u7a7a\u95f4\uff0c\u6240\u4ee5\u9700\u8981\u8bbe\u7f6e\u900f\u660e\u56fe\u6807\u3002\n\u4f60\u53ef\u4ee5\u5728\u4e0b\u9762\u793a\u4f8b\u4e2d\u7528darkIcon\u4ee3\u66ffnativeImage.createEmpty()\u7136\u540e\u6267\u884c\u770b\u4e00\u4e0b\u6548\u679c\u3002\n\n\u5982\u4f55\u5224\u65ad\u64cd\u4f5c\u7cfb\u7edf\u5e73\u53f0\uff0c[\u70b9\u51fb\u8fd9\u91cc](http://nodejs.cn/api/process/process_platform.html)\n\nwindows\u4e0b\u6548\u679c\uff1a\n\n","![]("+t(1341)+")","\n\n\u9644\u4ee3\u7801\uff1a\n\n```js\n// @@code-renderer: runner\n// @@code-props: {height: '880px', hideRight: true}\nconst { Tray, Menu, nativeTheme, BrowserWindow, nativeImage } = require('electron')\nconst path = require('path')\n\nlet tray\nlet timer\nlet toggle = true\nlet haveMessage = true\n\nconst lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')\nconst darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png')\n\nconst win = BrowserWindow.getFocusedWindow();\n\ntray = new Tray(lightIcon)\n\nconst contextMenu = Menu.buildFromTemplate([\n  {\n    label: '\u5f20\u4e09\u7684\u6d88\u606f',\n    click: () => {\n      let child = new BrowserWindow({ parent: BrowserWindow.getFocusedWindow() })\n      child.loadURL('https://electronjs.org')\n      child.show()\n    },\n  },\n  { type: 'separator' },\n  {\n    label: '\u5220\u9664\u56fe\u6807',\n    click: () => {\n      tray.destroy()\n      clearInterval(timer)\n    },\n  },\n])\n\ntray.setContextMenu(contextMenu)\n\ntray.setToolTip('Electron-Playground')\n\nif (haveMessage) {\n  timer = setInterval(() => {\n    toggle = !toggle\n    if (toggle) {\n      tray.setImage(nativeImage.createEmpty())\n    } else {\n      tray.setImage(lightIcon)\n    }\n  }, 600)\n}\n```\n\n### 2.4 \u53cc\u51fb\u6258\u76d8\u663e\u793a\u9690\u85cf\u754c\u9762(windows)\n\nwindows\u4e0b\u6548\u679c\uff1a\n\n","![]("+t(1342)+")","\n\n\u9644\u4ee3\u7801\uff1a\n\n\n```js\n// @@code-renderer: runner\n// @@code-props: {height: '260px', hideRight: true}\nconst { Tray, Menu, nativeTheme, BrowserWindow, nativeImage } = require('electron')\nconst path = require('path')\n\nlet tray\n\nconst lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')\n\nconst win = BrowserWindow.getFocusedWindow()\n\ntray = new Tray(lightIcon)\n\ntray.on('double-click', () => {\n  win.isVisible() ? win.hide() : win.show()\n})\n```\n\u6ce8\uff1a\u6b64\u6548\u679c\u5728windows\u4e0a\u826f\u597d\uff0c\u5728mac\u4e0b\u4f1a\u6709\u517c\u5bb9\u6027\u95ee\u9898\uff0c\u53cc\u51fb\u4e8b\u4ef6\u53ef\u80fd\u5931\u6548\uff0c\u5b9e\u9645\u4f7f\u7528\u8fc7\u7a0b\u4e2d\u8981\u6ce8\u610f\u3002\n"].join("")},1339:function(n,e,t){n.exports=t.p+"static/media/create-tray.50c09db0.gif"},1340:function(n,e,t){n.exports=t.p+"static/media/set-tray-title.d8865f3c.png"},1341:function(n,e,t){n.exports=t.p+"static/media/create-glimmer-tray.6a856e17.gif"},1342:function(n,e,t){n.exports=t.p+"static/media/create-toggle-tray.0e3493a7.gif"}}]);
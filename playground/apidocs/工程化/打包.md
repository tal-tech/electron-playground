# 打包

Electron常用的打包工具有这么几个：
- [electron-packager](https://github.com/electron/electron-packager)
- [electron-forge](https://github.com/electron-userland/electron-forge)
- [electron-builder](https://github.com/electron-userland/electron-builder)

`electron-packager`和`electron-builder`是单纯的Electron打包工具，`electron-forge`类似于一个CLI工具，参与从创建项目到开发和打包的流程。

`electron-packager`较为轻量，上手使用迅速，适合简单的项目打包。相对而言`electron-builder`配置更加复杂和全面一些，这里我们选择`electron-builder`作为打包工具。

## 1. 基本打包配置

首先我们需要将主进程、preload、渲染进程的代码编译输出到output目录，假定output目录下文件结构如下：
```
.
├── main
│   ├── index.js                // 主进程入口文件
│   ├── index.js.map
│   ├── preload.js              // preload文件
│   └── preload.js.map
└── renderer                    // 渲染进程的静态文件
    ├── static 
    ├── favicon.ico
    ├── index.html
    ├── manifest.json
    ├── precache-manifest.4afa4365236dd3705833cb35553e2f08.js
    ├── robots.txt
    ├── service-worker.js
    └── asset-manifest.json
```

### 1.1 添加build命令
在`package.json`中添加build命令：
```json
"build:main": "webpack --config ./build/webpack.config.main.js",
"build:preload": "webpack --config ./build/webpack.config.preload.js",
"build:renderer": "cd ./renderer && npm run build",
"build": "cross-env NODE_ENV=production concurrently \"npm run build:main\" \"npm run build:preload\" \"npm run build:renderer\""
```

启动 `npm run build`，可以发现output目录下生成了对应的文件目录。

### 1.2 安装electron-builder

安装必需的依赖项

```shell
yarn add electron-builder -D
```

package.json中添加"postinstall"命令，在安装依赖项后可以自动安装electron-builder的依赖项

```json
"postinstall": "electron-builder install-app-deps"
```

### 1.3 添加配置文件

在项目根目录添加`electron-builder.yml`，electron-builder会默认读取该文件作为配置文件。
```yaml
appId: 'com.my-app'
productName: 'My App'
copyright: Copyright © 2020 ${author}

directories:
  buildResources: resources
  output: release/${version}
  app: .

buildVersion: 1.0.0 
artifactName: ${productName}-${version}-${channel}.${ext}
files: 
  - output
  - resources
asar: true

publish: 
  - provider: generic
    url: https://update.electron-builder.com
    channel: latest
releaseInfo:
  releaseName: 'A New Playground for Electron!'
  releaseNotes: 'Some new features now is available.'
```

简单分析一下上面的配置文件：

- **appId**: 应用id，不同平台有不同的规则
  - [MacOS](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102070)
  - [Windows](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/a9eac961-e77d-41a6-90a5-ce1a8b0cdb9c?redirectedfrom=MSDN)
- **directories**
  - buildResources: 构建资源文件目录，不会打包到app中，如果需要打包其中的一些文件比如托盘图标，需要在files字段中指定，比如 `"files": ["**/*", "build/icon.*"]`
  - output: 打包输出目录
  - app: 包含package.json的应用目录，默认会读取 `app`, `www`, 或当前工作目录，通常不用指定 
- **files**: 指定需要复制过去打包的文件，[参考文档](https://www.electron.build/configuration/contents#files)
- **asar**: 是否打包成asar档案文件, [参考文档](https://www.electronjs.org/docs/tutorial/application-packaging)
- **publish**: 发布选项，和更新服务器类型相关， [参考文档](https://www.electron.build/configuration/publish)

### 1.4 添加打包命令

在package.json中添加打包命令:
```json
"pack-mac": "electron-builder build --mac",
"pack-win": "electron-builder build --win",
"pack-all": "electron-builder build -mw",
```

接下来开始打包，首先运行`yarn run build`，编译文件到output目录，接下来运行`yarn pack-all`，开始打包Windows和MacOS的应用。

运行结束后可以发现在release目录下出现了对应的版本文件夹，里面有打包好的安装文件和更新入口文件：
```
.
└── 1.0.0
    ├── My App-1.0.0-latest.dmg
    ├── My App-1.0.0-latest.dmg.blockmap
    ├── My App-1.0.0-latest.exe
    ├── My App-1.0.0-latest.exe.blockmap
    ├── My App-1.0.0-latest.zip
    ├── builder-effective-config.yaml
    ├── latest-mac.yml
    ├── latest.yml
    ├── mac
    └── win-unpacked
```

## 2. 代码签名

electron-builder支持MacOS和Windows的签名

但是由于MacOS应用的代码签名必须在MacOS机器上完成，而且MacOS可以进行Windows应用签名，因此建议使用MacOS机器进行打包签名。

### 2.1 MacOS代码签名

electron在进行代码签名的时候会自动检查环境变量中的对应字段，包括：

| 字段                            | 描述                                                                        |
| ------------------------------- | --------------------------------------------------------------------------- |
| **CSC_LINK**                    | .p12或.pfx证书文件的HTTPS链接（或base64编码数据，或file链接，或本地路径）。 |
| **CSC_KEY_PASSWORD**            | 证书密码                                                                    |
| **CSC_NAME**                    | (MacOS) login.keychain中的证书名称                                          |
| **CSC_IDENTITY_AUTO_DISCOVERY** | (MacOS) MacOS上是否自动使用keychain中的身份                                 |
| **CSC_KEYCHAIN**                | (MacOS) keychain名称。如果未指定CSC_LINK则使用。默认为系统默认keychain。    |
| **WIN_CSC_LINK**                | (Windows) 类似`CSC_LINK`，在MacOS上签名Windows应用时使用                    |
| **WIN_CSC_KEY_PASSWORD**        | (Windows) 类似`CSC_KEY_PASSWORD`，在MacOS上签名Windows应用时使用            |

在MacOS上签名就可以有几种选择：

1. 安装对应的证书到keychain，然后`CSC_NAME`指定为证书在keychain中显示的名称，`CSC_KEY_PASSWORD`设置为证书密码，打包时就会自动进行签名。

2. 将证书文件放在对应目录，`CSC_LINK`设置为对应的路径，`CSC_KEY_PASSWORD`设置为证书密码即可。若担心证书和密码都放在项目中不合适，可以去掉项目中的证书密码，修改打包脚本，每次运行打包命令时输入密码并设置到环境变量。

### 2.2 Windows代码签名

1. 在Windows机器上签名，同样的指定`CSC_LINK`和`CSC_KEY_PASSWORD`即可
1. 在Mac机器上签名，需要将`CSC_LINK`和`CSC_KEY_PASSWORD`替换为`WIN_CSC_LINK`和`WIN_CSC_KEY_PASSWORD`

如果需要申请Windows代码签名证书，可以参考这篇[文档](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/dashboard/get-a-code-signing-certificate)

## 3 更详细的平台target配置

electron-builder支持多种类型的安装文件打包
- Mac平台支持.dmg和.pkg，
- Windows平台支持nsis, nsisWeb, appx, squirrelWindows

### 3.1 MacOS配置

以MacOS下打包.dmg文件为例:
```yaml

mac:
  target:
    - dmg
  icon: resources/icon.icns
  category: public.app-category.developer-tools
  hardenedRuntime: true
  entitlements: resources/entitlements.mac.plist
  extendInfo: 
    NSMicrophoneUsageDescription: 请允许访问您的麦克风
    NSCameraUsageDescription: 请允许访问您的摄像头

dmg:
  background: resources/background.png
  iconSize: 128
  iconTextSize: 13
  window:
    width: 300
    height: 200
```

- **category** 应用在Mac下的分类，分类[参考文档](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)
- **hardenedRuntime** 应用是否使用hardenedRuntime进行签名。hardenedRuntime用于管理macOS应用程序的安全保护和资源访问。相关的[参考文档]()
- **entitlements** 对应的entitlements.mac.plist文件，该文件用于获取授权的定义。[参考文档](https://developer.apple.com/documentation/bundleresources/entitlements)
- **extendInfo** Info.plist的额外条目，主要用于配置一些应用属性。[参考文档](https://developer.apple.com/documentation/bundleresources/information_property_list)

比如下面这个entitlements.mac.plist
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.device.audio-input</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
  </dict>
</plist>
```
声明了对录音和摄像头权限的申请

## 3.2 Windows配置

以打包nsis文件为例
```yaml
win:
  target:
    - target: nsis
      arch:
        - x64
        - ia32
  icon: resources/icon.ico

nsis:
  oneClick: false
  perMachine: false
  allowToChangeInstallationDirectory: true
  license: resources/eula.txt
  deleteAppDataOnUninstall: false
  displayLanguageSelector: false
```

- **oneClick** 是否创建一个`oneClick`安装程序，和通常的windows安装程序不一样，`oneClick`安装程序点击后会直接安装，不需要一步一步选择选项然后点击确定，但在用户体验来说可能用户觉得不能选择安装目录，用户等选项有些流氓，而且看不到安装进度不知道什么时候安装成功。
- **perMachine** 是否显示安装模式，即选择安装给所有用户或者安装给当前用户
- **allowToChangeInstallationDirectory** 允许改变安装目录
- **license** 最终用户许可协议，支持.txt, .rtf, .html
- **deleteAppDataOnUninstall** 卸载时清除数据
- **displayLanguageSelector** 是否显示语言选择器，选否则根据系统语言自动判断

## 4. 多平台的插件打包

### 4.1 找到插件执行文件
在MacOS下通常是*.plugin文件，Windows下为*.dll文件，这里以32.0.0.414版本的flash player为例子，到adobe flash官网下载并安装flash player后，其目录通常在
- MacOS： /Library/Internet Plug-Ins/PepperFlashPlayer/PepperFlashPlayer.plugin
- Windows: C:\Windows\SysWOW64\Macromed\Flash\pepflashplayer32_0_0_414.dll 或 C:\Windows\System32\Macromed\Flash\pepflashplayer64_32_0_0_414.dll

### 4.2 添加编译配置

将找到的插件复制到项目的plugins目录下，根据平台区分目录，假设目录如下
```
plugins
├── darwin
│   └── PepperFlashPlayer.plugin
└── win32
    └── pepflashplayer.dll
```

接下来在webpack配置中添加配置，启动编译时可以将plugins下对应平台的文件自动复制到output下的plugins目录

```js
const CopyPlugin = require('copy-webpack-plugin')

// 根据平台判断插件目录
function getPluginSourceDir() {
  if (process.platform === "darwin") {
    return path.resolve(__dirname, "..", "plugins", "darwin");
  }
  if (process.platform === "win32") {
    return path.resolve(__dirname, "..", "plugins", "win32");
  }
  throw new Error(`can not find plugins directory for platform ${process.platform}`)
}

module.exports = {
  ...
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: getPluginSourceDir(),
          to: path.resolve(__dirname, '..', 'output', 'plugins'),
        },
      ],
    }),
  ]
}
```

### 4.3 加载插件

加载插件需要在app中通过调用对应的api，并且在创建BrowserWindow时将webPreferences选项中的plugins设置为true
```ts
let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    break
  case 'darwin':
    pluginName = 'PepperFlashPlayer.plugin'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '..','plugins', pluginName as string))

...

const window = new BrowserWindow({webPreferences: {preload: PRELOAD, plugins: true}})
```
加载一个包含flash的url
```ts
window.loadURL(EXAMPLE_FLASH_URL)
```
重新启动应用，发现flash可以正常运行了

### 4.4 加载系统安装的 Pepper Flash 插件

这种方式只适用于flash插件，上面的根据平台获取插件，加载指定目录等操作都不需要了，而是直接加载系统已经安装的flash插件，这也意味着如果系统没有安装flash插件就无法使用

```ts
app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'))

...

const window = new BrowserWindow({webPreferences: {preload: PRELOAD, plugins: true}})
```

## 5 创建多平台多环境打包的命令行工具

在实际业务中，打包往往不是单纯的`electron-builder build`就可以实现，可能会有许多类似区分环境和平台，定制打包产出，打包后上传等需求，在这种时候可能就需要做一些更复杂的工作了。

比如在一个常见的业务场景，需要实现以下功能：
1. 版本更新;
1. 同步更新信息到CHANGELOG;
1. 区分环境打包;
1. 区分平台打包;
1. 打包后自动上传;

针对这些功能做一个流程设计：
1. 输入版本号(不输入则自动patch)后，校验版本号是否正确，更新package.json
1. 输入更新的信息和更新的描述，并同步写入到CHANGELOG
1. 读取用户选择的环境，可以多选，并在后续的打包流程中针对不同环境实现不同的操作(环境变量注入等);
1. 读取用户选择的平台，可以多选，在后续打包中只打包对应的平台;
1. 打包结束后自动上传到服务器(以ftp为例);

接下来根据功能流程设计来划分功能模块：
1. Inquirer: 读取用户输入项并提供校验;
1. CommandExecutor: 执行命令行命令的函数;
1. JsonUpdater: 提供读写操作更新package.json和package-lock.json;
1. ChangelogUpdater: 更新CHANGELOG
1. Builder: 使用electron-builder进行打包操作
1. FileUploader: 通过ftp进行文件上传

接下来实现这些功能模块：

`build/packaging-cli/inquirer.ts`
```ts
import * as inquirer from "inquirer";

const envs = ["test", "prod"] as const;
const platforms = ["win", "mac"] as const;

export type envType = typeof envs[number]
export type platformType = typeof platforms[number]

const options = [
  { type: "input", name: "version", message: `版本号？` },
  { type: "input", name: "releaseName", message: `更新标题`, default: "更新" },
  { type: "editor", name: "releaseNotes", message: `更新描述:` },
  {
    type: "list",
    name: "env",
    message: "环境？",
    choices: envs.map((e) => ({ name: e, value: e })),
  },
  {
    type: "list",
    name: "platforms",
    message: "平台？",
    choices: [
      { name: "all", value: platforms },
      ...platforms.map((p) => ({ name: p, value: [p] })),
    ],
  },
];

interface QueryResult {
  env: envType;
  platforms: platformType[];
  version: string;
  releaseName: string;
  releaseNotes: string;
}

export async function query() {
  const result = await inquirer.prompt<QueryResult>(options);
  console.log(result);
  return result;
}
```

`build/packaging-cli/command-executor.ts`
```ts
import { spawn } from 'child_process'

export function execCommand(command: string, args: string[]) {
  return new Promise((resolve, reject) => {
    const ls = spawn(command, args, { stdio: 'inherit' })

    ls.on('error', error => {
      console.error(error.message)
    })

    ls.on('close', code => {
      console.log(`[${command} ${args.join(' ')}]` + `exited with code ${code}`)
      code === 0 ? resolve() : reject(code)
    })
  })
}
```

`build/packaging-cli/json-updater.ts`
```ts
import * as path from "path";
import { readJsonSync, writeJSONSync } from "fs-extra";

export const PACKAGE_JSON_PATH = path.resolve(__dirname, "..", "..", "package.json");
export const PACKAGE_JSON_LOCK_PATH = path.resolve(__dirname, "..", "..", "package-lock.json");

// 读取json内容
export const readJSON = (path: string) => () => readJsonSync(path);

// 覆写json变量
export const writeJSON = (path: string) => (vars: any) => writeJSONSync(path, vars);
```

`build/packaging-cli/changelog-updater.ts`
```ts
import * as fs from 'fs'
import * as path from 'path'
import dayjs from 'dayjs'

interface ChangeLog {
  version: string
  releaseName: string
  releaseNotes: string
}

const CHANGE_LOG_PATH = path.resolve(__dirname, '..', '..', 'CHANGELOG.md')

export function updateChangeLog(cl: ChangeLog) {
  const { version, releaseName, releaseNotes } = cl
  const content = `## 版本：${version}

- ${dayjs().format('YYYY-MM-DD hh:mm:ss')}
    
${releaseName}
    
\`\`\` 
${releaseNotes}
\`\`\`
`

  fs.appendFileSync(CHANGE_LOG_PATH, content)
}
```

`build/packaging-cli/builder.ts`
```ts
import { envType, platformType } from "./inquirer";
import { execCommand } from "./command-executor";

export async function build(env: envType, platforms: platformType[]) {
  process.env.ENV = env;
  await execCommand(`npm`, ["run", "build"]);

  let buildArgs = ["build"];
  if (platforms.includes("win")) buildArgs.push("--win");
  if (platforms.includes("mac")) buildArgs.push("--mac");

  await execCommand(`electron-builder`, buildArgs);
}
```

```ts
import FTPClient from "ftp";
import * as path from "path";
import * as fs from "fs";

const clientConfig = {
  host: "host.to.your.server",
  port: 60021,
  user: "username",
  password: "password",
};

const Client = new FTPClient();

function connectClient() {
  return new Promise((resolve, reject) => {
    Client.on("ready", resolve);
    Client.on("error", reject);
    Client.connect(clientConfig);
  });
}

function putFile(file: string, dest: string) {
  return new Promise((resolve, reject) => {
    Client.put(file, dest, (err) => (err ? reject(err) : resolve()));
  });
}

export async function uploadDir(dir: string, dest: string) {
  await connectClient();

  const task: [string, string][] = fs
    .readdirSync(dir)
    .map((f) => path.resolve(dir, f))
    .filter((f) => fs.statSync(f).isFile())
    .map((f) => ([f, `${dest}/${path.basename(f)}`]));

  await Promise.all(task.map(([src, dest]) => putFile(src, dest)));

  Client.end();
}
```

最后是packaging-cli脚本的入口文件，统领整个打包流程;

`build/packaging-cli/index.ts`
```ts
import { query } from "./inquirer";
import { readJSON, PACKAGE_JSON_PATH } from "./json-updater";
import { execCommand } from "./command-executor";
import { updateChangeLog } from "./changelog-updater";
import { build } from "./builder";
import * as path from "path";
import { uploadDir } from "./file-uploader";

const RELEASE_DIR = path.resolve(__dirname, "..", "..", "release");

async function startPackaging() {
  let { version, env, platforms, releaseName, releaseNotes } = await query();

  // 更新版本号
  await execCommand("npm", ["version", version ? version : "patch"]);
  version = readJSON(PACKAGE_JSON_PATH)().version;
  // 更新CHANGELOG
  updateChangeLog({ version, releaseName, releaseNotes });
  // 开始打包
  await build(env, platforms);
  // 上传文件
  await uploadDir(path.resolve(RELEASE_DIR, version), "test-app-temp")
}

startPackaging();
```

在package.json中添加命令
```json
"pack": "ts-node ./build/packaging-cli/index.ts",
```

运行`yarn run pack`即可开始打包

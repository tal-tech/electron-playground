import * as fs from 'fs'
import * as path from 'path'
import dayjs from 'dayjs'
import * as os from 'os'
import { readJsonSync } from 'fs-extra'

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

// 根据变量名构建一个正则，匹配对应模板中的变量表示
function createReg(variable: string) {
  return new RegExp(`{{${variable}}}`, 'g')
}

// 处理换行，yaml中的换行需要空一行来表示，需要将\n变成\n\n
function processEOL(str: string) {
  return str.replace(new RegExp(os.EOL, 'g'), os.EOL + os.EOL)
}

// 修改electron-builder-template配置，替换electron-builder.yaml
export function updateFillBuilderYAML(option: object) {
  // 配置路径
  const ELECTRON_BUILDER_TEMPLATE = path.resolve(
    __dirname,
    '..',
    '..',
    'electron-builder-template.yml',
  )
  const ELECTRON_BUILDER_OUTPUT = path.resolve(__dirname, '..', '..', 'electron-builder.yml')
  let content = fs.readFileSync(ELECTRON_BUILDER_TEMPLATE).toString()
  // 替换匹配到的每个变量
  Object.entries(option).forEach(
    ([key, val]) => (content = content.replace(createReg(key), processEOL(val)))
  )

  fs.writeFileSync(ELECTRON_BUILDER_OUTPUT, content)
}



// 读取json内容
export const readJSON = (path: string) => () => readJsonSync(path)

// 覆写json变量
export const writeJSON = (path: string) => (vars: { [index: string]: any }) => {
  const content = readJSON(path)()
  for (const key in vars) {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      const element = vars[key]
      content[key] = element
    }
  }

  const contentStr = JSON.stringify(content, null, 2)
  fs.writeFileSync(path, contentStr, { encoding: 'utf8' })
}

const package_json_path = path.resolve(__dirname, '..', '..', 'package.json')
export const readPackageJSON = readJSON(package_json_path)
export const writePackageJSON = writeJSON(package_json_path)
import * as inquirer from 'inquirer'
import { execCommand, NPM_COMMAND } from './pack/tool'
import { readPackageJSON, updateChangeLog } from './pack/change-file'
import { build } from './pack/buid'

// 校验版本号
function validateVersion(input: string) {
  if (!input || /^\d+(?:\.\d+){2}$/.test(input)) {
    return true
  }
  console.log('请输入正确的版本号(X.Y.Z)')
  return false
}

export interface BuildOptions {
  platforms: string[]
  version: string
  releaseName: string
  releaseNotes: string
}

async function startPack() {
  const options = await inquirer.prompt<BuildOptions>([
    {
      type: 'list',
      name: 'platforms',
      message: '平台？',
      choices: [
        { name: 'all', value: ['win', 'mac'] },
        { name: 'win', value: ['win'] },
        { name: 'mac', value: ['mac'] },
      ],
    },
    {
      type: 'input',
      name: 'version',
      message: `版本号？(当前为${readPackageJSON().version})`,
      validate: validateVersion,
    },
    {
      type: 'input',
      name: 'releaseName',
      message: `更新标题(不输入则为默认标题 \`版本更新\`):`,
      default: '版本更新',
    },
    { type: 'input', name: 'releaseNotes', message: `更新描述:` },
  ])

  console.log(options)

  // 更新版本号
  await execCommand(NPM_COMMAND, [`version`, options.version || 'patch', '--allow-same-version'])
  options.version = readPackageJSON().version

  // 更新changelog (只有打包包括正式环境时更新)
  updateChangeLog({ ...options })

  // 打包
  await build(options)

  // git提交
  await execCommand('git', ['commit', '-a', '-m', `feat: CHANGELOG更新 V${options.version}`])
}

startPack()
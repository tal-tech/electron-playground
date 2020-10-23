import { execCommand, NPM_COMMAND } from './tool'
import { updateFillBuilderYAML } from './change-file'

interface BuildOptions {
  platforms: string[]
  version: string
  releaseName: string
  releaseNotes: string
}

export async function build(option: BuildOptions) {
  for (const platform of option.platforms) {
    await execCommand(NPM_COMMAND, ['run', 'clean']) // 删除之前打包的
    await packTask(option, platform)
  }
}

async function packTask(option: BuildOptions, platform: string) {
  const params = {
    RELEASE_NAME: option.releaseName,
    RELEASE_NOTES: option.releaseNotes,
  }
  updateFillBuilderYAML(params)

  process.env.NODE_ENV = 'production'
  // 编译主进程和渲染进程的文件到dist
  await execCommand(NPM_COMMAND, ['run', 'build'])
  // 打包对应平台的安装包
  await execCommand(NPM_COMMAND, ['run', `pack-${platform}`])
}

/* eslint-disable  no-await-in-loop, no-async-promise-executor,consistent-return,@typescript-eslint/no-inferrable-types */
import { spawn, ChildProcess } from 'child_process'
import { message } from 'antd'
import { download } from '@electron/get'
import { remote } from 'electron'
import { MosaicNode, MosaicDirection } from 'react-mosaic-component'
import * as fs from 'fs-extra'
import extract from 'extract-zip'
import * as path from 'path'
import { EditorId } from '.'

export interface Files {
  'renderer.js'?: string
  'main.js'?: string
  'index.html'?: string
  'preload.js'?: string
}

let lock = true
export { ChildProcess }

function getDownloadPath(version: string): string {
  return path.join(remote.app.getPath('appData'), 'electron-bin', version)
}

export function getElectronBinaryPath(
  version: string,
  dir: string = getDownloadPath(version),
): string {
  switch (process.platform) {
    case 'darwin':
      return path.join(dir, 'Electron.app/Contents/MacOS/Electron')
    case 'freebsd':
    case 'linux':
      return path.join(dir, 'electron')
    case 'win32':
      return path.join(dir, 'electron.exe')
    default:
      throw new Error(
        `Electron builds are not available for ${process.platform}`,
      )
  }
}

interface Progress {
  percent: number;
  transferred: number;
  total: number;
}

export async function electronDownload(version: string) {
  const getProgressCallback = (progress: Progress) => {
    console.debug(
      `Binary: Version ${version} download progress: ${progress.percent}`,
    )
  }
  console.log('正在下载')
  const zipFilePath = await download(version, {
    downloadOptions: {
      quiet: true,
      getProgressCallback,
    },
    mirrorOptions:{
      mirror:'https://npm.taobao.org/mirrors/electron/'
    }
  })

  return zipFilePath
}

export async function getIsDownloaded(
  version: string,
  dir?: string,
): Promise<boolean> {
  const expectedPath = getElectronBinaryPath(version, dir)
  return fs.existsSync(expectedPath)
}

function unzip(zipPath: string, extractPath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    process.noAsar = true
    const options = {
      dir: extractPath,
    }

    try {
      const file = await extract(zipPath, options)
      resolve(file)
    } catch (error) {
      reject(error)
    }

  })
}

export async function setupBinary(): Promise<void> {
  if (!lock) return
  lock = false
  const version = process.versions.electron

  await fs.mkdirp(getDownloadPath(version))
  if (await getIsDownloaded(version)) {
    lock = true
    return
  }
  const hide = message.loading(`正在下载${version}版本的Electron`, 0)
  const zipPath = await electronDownload(version)
  const extractPath = getDownloadPath(version)

  const electronFiles = await unzip(zipPath, extractPath)
  hide()
  message.success('下载成功')
  lock = true
  console.log(`Unzipped ${version}`, electronFiles)
}

const DIST_PATH = path.resolve(__dirname, '..',)

export const SAVE_CODE_PATH = path.join(DIST_PATH, 'tmp')

export const execute = async (): Promise<ChildProcess | null> => {
  await setupBinary()
  const child = spawn(getElectronBinaryPath(process.versions.electron), [path.join(SAVE_CODE_PATH, 'main.js'), '--inspect'])
  child.stdout.on('data', data => {
    console.log(`stdout: ${data}`)
  })

  child.stderr.on('data', data => {
    console.error(`stderr: ${data}`)
  })

  child.on('close', code => {
    console.log(`子进程退出，退出码 ${code}`)
  })
  return child
}

export const saveToTemp = async (values: Files) => {
  await fs.emptyDir(SAVE_CODE_PATH)
  for (const name in values) {
    // @ts-ignore
    await fs.outputFile(path.join(SAVE_CODE_PATH, name), values[name])
  }
}

export const getExamplePath = (
  example: 'renderer.ts' | 'main.ts' | 'index.html' | 'preload.ts',
  type: string,
): string => {
  try {
    return path.resolve(__dirname, '..', 'example', type, example)
  } catch (error) {
    console.log(error)
    return ''
  }
}

export const readFile = function (path: string): string {
  return fs.readFileSync(path).toString()
}

export const getFiles = async (example: string = 'template'): Promise<Files> => {
  const renderer = await getExamplePath('renderer.ts', example)
  const main = await getExamplePath('main.ts', example)
  const html = await getExamplePath('index.html', example)
  const preload = await getExamplePath('preload.ts', example)

  return {
    'renderer.js': readFile(renderer),
    'main.js': readFile(main),
    'index.html': readFile(html),
    'preload.js': readFile(preload),
  }
}

export function getVisibleMosaics(input: MosaicNode<EditorId> | null): Array<EditorId> {
  if (!input) return []

  if (typeof input === 'string') {
    return [input]
  }
  const result = []
  for (const node of [input.first, input.second]) {
    if (typeof node === 'string') {
      result.push(node)
    } else {
      result.push(...getVisibleMosaics(node))
    }
  }

  return result
}

export function createMosaicArrangement(
  input: Array<EditorId>,
  direction: MosaicDirection = 'row',
): MosaicNode<EditorId> {
  if (input.length === 1) {
    return input[0]
  }

  // This cuts out the first half of input. Input becomes the second half.
  const secondHalf = [...input]
  const firstHalf = secondHalf.splice(0, Math.floor(secondHalf.length / 2))

  return {
    direction,
    first: createMosaicArrangement(firstHalf, 'column'),
    second: createMosaicArrangement(secondHalf, 'column'),
  }
}

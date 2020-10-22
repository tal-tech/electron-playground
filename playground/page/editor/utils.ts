/* eslint-disable  no-await-in-loop, no-async-promise-executor,consistent-return,@typescript-eslint/no-inferrable-types */
import { spawn, ChildProcess } from 'child_process'
import { MosaicNode, MosaicDirection } from 'react-mosaic-component'
import * as fs from 'fs-extra'
import * as path from 'path'
import { EditorId } from '.'

export interface Files {
  'renderer.js'?: string
  'main.js'?: string
  'index.html'?: string
  'preload.js'?: string
}

export { ChildProcess }

const DIST_PATH = path.resolve(__dirname, '..', '..', '..', './dist')

const ELECTRON_BIN_PATH = path.join('node_modules', '.bin', 'electron')

export const SAVE_CODE_PATH = path.join(DIST_PATH, 'tmp')

export const execute = (): ChildProcess => {
  const child = spawn(ELECTRON_BIN_PATH, [path.join(SAVE_CODE_PATH, 'main.js'), '--inspect'])
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
    return path.resolve(__dirname, '..', '..', '..', './dist', './example', `${type}/${example}`)
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

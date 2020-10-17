import path from 'path'

export const ROOT_PATH = process.cwd()

export const getSrcRelativePath = (relativePath: string) => path.join(ROOT_PATH, relativePath)

export const editorRelativePath = `file:///${  path.resolve(__dirname, '../../dist/playground/index.html#/editor')}`
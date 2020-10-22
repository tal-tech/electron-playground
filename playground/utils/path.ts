import path from 'path'

export const ROOT_PATH = process.cwd()

export const getSrcRelativePath = (relativePath: string) => path.join(ROOT_PATH, relativePath)
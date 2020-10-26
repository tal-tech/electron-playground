import fs from 'fs'
import path from 'path'
import { app, shell } from 'electron'

export { v4 as uuidV4 } from 'uuid'

/**
 * 获取文件后缀名
 * @param fileName - 文件名
 */
export const getFileExt = (fileName: string): string => path.extname(fileName)

/**
 * 拼接路径
 * @param p - 路径
 */
export const pathJoin = (...p: string[]): string => path.join(...p)

/**
 * 获取文件名
 * @param fileName - 文件名
 * @param defaultName - 默认文件名
 */
export const getFileName = (fileName: string, defaultName: string): string => {
  // 处理 Windows 文件名不允许的字符
  fileName = fileName.replace(/(\/|\|?:|\?|\*|"|>|<|\|)/g, '') || path.basename(defaultName)
  fileName = /^\.(.*)/.test(fileName) ? defaultName : fileName

  const extName = getFileExt(fileName)
  if (!extName) {
    const ext = getFileExt(defaultName)
    fileName = `${fileName}.${ext}`
  }

  return decodeURIComponent(fileName)
}

/**
 * 获取文件图标。
 * 系统关联图标
 * @param path - 文件路径
 */
export const getFileIcon = async (path: string): Promise<string> => {
  const iconDefault = './icon_default.png'
  if (!path) Promise.resolve(iconDefault)

  const icon = await app.getFileIcon(path, {
    size: 'normal',
  })

  return icon.toDataURL()
}

/**
 * 检查文件是否存在
 * @param path - 文件路径
 */
export const isExistFile = (path: string): boolean => fs.existsSync(path)

/**
 * 删除指定路径文件
 * @param path - 文件路径
 */
export const removeFile = (path: string): void => {
  if (!isExistFile(path)) return

  fs.unlinkSync(path)
}

/**
 * 打开文件
 * @param path - 文件路径
 */
export const openFile = (path: string): boolean => {
  if (!isExistFile(path)) return false

  shell.openPath(path)
  return true
}

/**
 * 打开文件所在位置
 * @param path - 文件路径
 */
export const openFileInFolder = (path: string): boolean => {
  if (!isExistFile(path)) return false

  shell.showItemInFolder(path)
  return true
}

/**
 * 获取 base64 图片字节
 * @param base64 - base64 字符串
 */
export const getBase64Bytes = (base64: string): number => {
  if (!/^data:.*;base64/.test(base64)) return 0

  const data = base64.split(',')[1].split('=')[0]
  const { length } = data

  return Math.floor(length - (length / 8) * 2)
}

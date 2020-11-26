import path from 'path'
import { readdirSync, existsSync } from 'fs'
import { app, session } from 'electron'

const EXTENSION_FOLDER = (function extensionFolder() {
  const { platform } = process

  if (platform !== 'darwin' && platform !== 'win32' && platform !== 'linux') {
    throw new Error(`not support platform: ${platform}`)
  }

  let folderPath!: string
  if (platform === 'darwin') {
    folderPath = path.resolve(
      app.getPath('home'),
      'Library/Application Support/Google/Chrome/Default/Extensions',
    )
  }

  if (platform === 'win32') {
    folderPath = path.resolve(
      app.getPath('home'),
      'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions',
    )
  }

  if (platform === 'linux') {
    const availablePath = [
      '.config/google-chrome/Default/Extensions/',
      '.config/google-chrome-beta/Default/Extensions/',
      '.config/google-chrome-canary/Default/Extensions/',
      '.config/chromium/Default/Extensions/',
    ].map(p => path.resolve(app.getPath('home'), p))

    const exactPath = availablePath.find(p => existsSync(p))
    if (!exactPath) {
      throw new Error('no extension folder')
    }

    folderPath = exactPath
  }

  if (existsSync(folderPath)) {
    return folderPath
  } else {
    console.error('no extension folder')
    return ''
  }
})()

function addDevToolsExtension(id: string) {
  if(!EXTENSION_FOLDER) return
  const extensionPath = path.resolve(EXTENSION_FOLDER, id)

  if (!existsSync(extensionPath)) {
    return
  }

  const versionName = readdirSync(extensionPath).find(
    v => existsSync(path.resolve(extensionPath, v)) && /\d+\.\d+\.\d/.test(v),
  )

  if (versionName) {
    session.defaultSession.loadExtension(path.resolve(extensionPath, versionName))
  }
}

const EXTENSION_IDS: string[] = [
  'fmkadmapgofadopljbjfkapdkoienihi', // React Developer Tools
  // 'aapbdbdomjkkjkaonfhkkikfgjllcleb', // Google Translate
]

export function addDevToolsExtensionAtDevelopmentMode() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  EXTENSION_IDS.forEach(id => addDevToolsExtension(id))
}

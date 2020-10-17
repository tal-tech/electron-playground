// https://docs.sentry.io/platforms/javascript/electron/#configuring-the-client
import { Scope, configureScope } from '@sentry/electron'
import { dialog, app, ipcMain,BrowserWindow, MessageBoxOptions } from 'electron'
import { getMachineId } from '../config'

const { init } =
  process.type === 'browser'
    ? require('@sentry/electron/dist/main')
    : require('@sentry/electron/dist/renderer')

    
// https://docs.sentry.io/enriching-error-data/additional-data/
configureScope((scope: Scope) => {
  // Users are applied to construct a unique identity in Sentry.
  scope.setUser({id: getMachineId()})
})
// Initialize the sentry
init({
  dsn: process.env.SENTRY_DSN,
  debug: process.env.ENV_TYPE !== 'prod',
})
// Monitor error messages sent by the renderer
ipcMain.on('renderer.error', (event, option) => {
  console.error(event, option)
  throw new Error('Error triggered in main processes')
})


/**
 * Crash listen on the created window
 * @param win BrowserWindow
 */
export function addCrashListener(win: BrowserWindow) {
  // https://www.electronjs.org/docs/api/web-contents#event-crashed-deprecated
  win.webContents.on('crashed', async (event,killed) => {
    console.log(event,killed)
    const options: MessageBoxOptions = {
      type: 'info',
      title: 'The renderer process crashes',
      message: 'The renderer process crashes.',
      buttons: ['quit app', 'reload'],
    }
    const { response } = await dialog.showMessageBox(win, options)
    // 1 reload 0 quit app
    response ? win.reload() : app.quit()
  })
}
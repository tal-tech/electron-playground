import { BrowserWindow } from 'electron'
import { registerDownloadService } from './download'

export const registerFileManagerService = (win: BrowserWindow): void => {
  registerDownloadService()
}

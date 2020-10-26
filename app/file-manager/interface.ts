import { DownloadItem, WebContents } from 'electron'

export type DownloadItemState = 'progressing' | 'completed' | 'cancelled' | 'interrupted'

export type IPCEventName =
  | 'openDownloadManager'
  | 'getDownloadData'
  | 'newDownloadFile'
  | 'retryDownloadFile'
  | 'openFileDialog'
  | 'openFile'
  | 'openFileInFolder'
  | 'initDownloadItem'
  | 'pauseOrResume'
  | 'removeDownloadItem'
  | 'clearDownloadDone'
  | 'newDownloadItem'
  | 'downloadItemUpdate'
  | 'downloadItemDone'

export interface INewDownloadFile {
  url: string
  fileName?: string
  path: string
}

export interface IDownloadFile {
  id: string
  url: string
  icon: string
  fileName: string
  path: string
  state: DownloadItemState
  startTime: number
  speed: number
  progress: number
  totalBytes: number
  receivedBytes: number
  paused: boolean
  _sourceItem: DownloadItem | undefined
}

export interface IDownloadBytes {
  receivedBytes: number
  totalBytes: number
}

export interface IPagination {
  pageIndex: number
  pageCount: number
}

export interface IAddDownloadItem {
  item: DownloadItem
  downloadIds: string[]
  data: IDownloadFile[]
  newDownloadItem: INewDownloadFile | null
}

export interface IUpdateDownloadItem {
  item: DownloadItem
  data: IDownloadFile[]
  downloadItem: IDownloadFile
  prevReceivedBytes: number
  state: DownloadItemState
}

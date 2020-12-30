import React from 'react'
import { Tooltip } from 'antd'
import {
  PauseOutlined,
  CaretRightOutlined,
  FolderViewOutlined,
  CloseOutlined,
} from '@ant-design/icons'

import IconButton from './icon-button'
import { IDownloadFile } from '../../../../app/file-manager/interface'

import styles from './style.module.less'

interface DownloadProps {
  item: IDownloadFile
  index: number
  onOpenFile?: (path: string) => void
  onPauseOrResume?: (item: IDownloadFile) => void
  onOpenFolder?: (path: string) => void
  onCancel?: (item: IDownloadFile, index: number) => void
}

/**
 * 处理文件大小
 * @param bytes - 字节
 * @param isUnit - 是否需要单位，默认 `true`
 */
export const getFileSize = (bytes: number, isUnit?: boolean): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  isUnit = isUnit ?? true

  if (bytes === 0) {
    return isUnit ? '0B' : '0'
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) {
    return bytes + (isUnit ? sizes[i] : '')
  }
  return (bytes / 1024 ** i).toFixed(2) + (isUnit ? sizes[i] : '')
}

const DownloadItem = ({
  item,
  index,
  onOpenFile,
  onPauseOrResume,
  onOpenFolder,
  onCancel,
}: DownloadProps) => {
  return (
    <div className={styles['download-item-container']} key={item.id}>
      {/* 下载进度 */}
      {item.state === 'progressing' && (
        <div
          className={styles['download-item-progress']}
          style={{ width: `${item.progress * 100}%` }}
        />
      )}

      <div className={styles['download-item-main']}>
        {/* 下载项的图标 */}
        <div className={styles['file-icon']} onDoubleClick={() => onOpenFile?.(item.path)}>
          <img src={item.icon} />
        </div>
        {/* 文件名、下载大小、速度 */}
        <div className={styles['file-info']}>
          <Tooltip title={item.fileName}>
            <p className={styles['file-name']}>{item.fileName}</p>
          </Tooltip>
          <div className={styles['file-desc']}>
            {item.state === 'progressing' ? (
              <>
                <div className={styles['file-size']}>
                  {getFileSize(item.receivedBytes, false)}/{getFileSize(item.totalBytes)}
                </div>
                <span className={styles['download-speed']}>{getFileSize(item.speed)}/s</span>
              </>
            ) : null}
            {item.state === 'completed' && <p>{getFileSize(item.totalBytes)}</p>}
          </div>
        </div>
        {/* 操作 */}
        <div className={styles.operating}>
          {item.state === 'progressing' && (
            <IconButton
              title={item.paused ? '恢复' : '暂停'}
              className={styles['operating-item']}
              onClick={() => onPauseOrResume?.(item)}>
              {item.paused ? <CaretRightOutlined /> : <PauseOutlined />}
            </IconButton>
          )}

          {item.state === 'completed' && (
            <IconButton
              title='打开所在位置'
              className={styles['operating-item']}
              onClick={() => onOpenFolder?.(item.path)}>
              <FolderViewOutlined />
            </IconButton>
          )}

          <IconButton
            title={`${item.state === 'progressing' ? '取消并' : ''}移除下载`}
            className={styles['operating-item']}
            onClick={() => onCancel?.(item, index)}>
            <CloseOutlined />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default DownloadItem

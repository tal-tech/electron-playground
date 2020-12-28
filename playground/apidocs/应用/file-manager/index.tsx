import React from 'react'
import { Button } from 'antd'

import Markdown from '../../../components/markdown'

import { openDownloadManager } from './ipc-renderer'
import DocDownload from './download/markdown/index.md'

const DownloadHome = () => {
  const handleOpenDownloadManager = () => {
    openDownloadManager()
  }

  return (
    <div>
      <h2>下载管理器</h2>
      <p>点击“打开下载管理器”按钮体验一下。</p>
      <p>
        <Button type='primary' onClick={handleOpenDownloadManager}>打开下载管理器</Button>
      </p>
      <Markdown content={DocDownload} />
    </div>
  )
}

export default DownloadHome

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { message, Modal } from 'antd'

import CreateModal from './create'
import styles from './style.module.less'

import DownloadManagerMenu from './components/manager-menu'
import DownloadItem from './components/download-item'
import { IDownloadFile } from '../../../app/file-manager/interface'
import {
  clearDownloadDone,
  getDownloadData,
  listenerDownloadItemDone,
  listenerDownloadItemUpdate,
  listenerNewDownloadItem,
  openFile,
  openFileInFolder,
  pauseOrResume,
  removeDownloadItem,
} from './ipc-renderer'

const DownloadManager = () => {
  const [show, setShow] = useState(false)
  const [downloadItem, setDownloadItem] = useState<IDownloadFile[]>([])
  const [hasMore, setHasMore] = useState(true)

  const downloadItemRef = useRef<IDownloadFile[]>([])
  const pageIndex = useRef(1)
  const pageCount = useRef(6)

  // 初始化下载数据
  const initData = useCallback(async () => {
    const data = await getDownloadData({
      pageIndex: pageIndex.current,
      pageCount: pageCount.current,
    })

    if (!data.length) {
      pageIndex.current -= 1
      setHasMore(false)
      return
    }

    downloadItemRef.current.push(...data)
    setDownloadItem(downloadItemRef.current)
    setHasMore(true)
  }, [])

  // 更新下载数据
  const handleUpdateData = useCallback((item: IDownloadFile) => {
    const index = downloadItemRef.current.findIndex(d => d.id === item.id)

    if (index < 0) {
      downloadItemRef.current.unshift(item)
    } else {
      downloadItemRef.current[index] = item
    }

    setDownloadItem([...downloadItemRef.current])
  }, [])

  // 滚动到底部自动加载更多
  const handleScroll = (event: any) => {
    // 滚动条的总高度，可视区的高度，距离顶部的距离
    const { scrollHeight, clientHeight, scrollTop } = event.target

    if (scrollTop + clientHeight + 10 >= scrollHeight && hasMore) {
      // 滚动到底部
      pageIndex.current += 1
      initData()
    }
  }

  // 打开新建下载弹框
  const handleOpenCreate = () => {
    setShow(true)
  }

  // 关闭新建下载弹框
  const handleCloseCreate = () => {
    setShow(false)
  }

  // 暂停或恢复下载
  const handlePauseOrResume = async (item: IDownloadFile) => {
    const data = await pauseOrResume(item)
    handleUpdateData(data)
  }

  // 双击图标打开文件
  const handleOpenFile = async (path: string) => {
    const res = await openFile(path)

    if (!res) {
      message.error('文件不存在')
    }
  }

  // 打开文件所在目录
  const handleOpenFolder = async (path: string) => {
    const res = await openFileInFolder(path)

    if (!res) {
      message.error('文件不存在')
    }
  }

  // 删除下载项
  const handleRemove = (item: IDownloadFile, index: number) => {
    Modal.confirm({
      content: `确定${item.state === 'progressing' ? '取消并' : ''}移除下载项吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        removeDownloadItem(item, index).finally(() => {
          downloadItemRef.current.splice(index, 1)
          setDownloadItem([...downloadItemRef.current])
        })
      },
    })
  }

  // 清空已完成
  const handleClearDone = () => {
    Modal.confirm({
      content: '确定清空已完成的下载吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const data = await clearDownloadDone()

        downloadItemRef.current = data
        setDownloadItem([...data])
      },
    })
  }

  useEffect(() => {
    listenerNewDownloadItem((event, item: IDownloadFile) => {
      handleCloseCreate()
      handleUpdateData(item)
    })

    listenerDownloadItemUpdate((event, item: IDownloadFile) => {
      handleUpdateData(item)
    })

    listenerDownloadItemDone((event, item: IDownloadFile) => {
      handleUpdateData(item)
    })

    initData()
  }, [handleUpdateData, initData])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>下载管理器 - demo</div>
        <DownloadManagerMenu onCreate={handleOpenCreate} onClear={handleClearDone} />

        <div className={styles.main} onScroll={handleScroll}>
          {downloadItem.map((item, index) => (
            <DownloadItem
              key={item.id}
              item={item}
              index={index}
              onOpenFile={handleOpenFile}
              onPauseOrResume={handlePauseOrResume}
              onOpenFolder={handleOpenFolder}
              onCancel={handleRemove}
            />
          ))}
        </div>
      </div>

      <CreateModal show={show} onClose={handleCloseCreate} />
    </>
  )
}

export default DownloadManager

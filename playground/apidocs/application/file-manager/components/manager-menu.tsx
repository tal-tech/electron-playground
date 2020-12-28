import React from 'react'
import { Button } from 'antd'

import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import styles from './style.module.less'

interface DownloadManagerMenuProps {
  onCreate?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClear?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const DownloadManagerMenu = ({ onCreate, onClear }: DownloadManagerMenuProps) => {
  return (
    <div className={styles['menu-container']}>
      <Button type='text' icon={<PlusOutlined />} onClick={onCreate}>
        新建下载
      </Button>
      <Button type='text' icon={<DeleteOutlined />} onClick={onClear}>
        清空已完成
      </Button>
    </div>
  )
}

export default DownloadManagerMenu

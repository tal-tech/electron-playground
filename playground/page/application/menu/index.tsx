import React from 'react'
import { ipcRenderer } from 'electron'
import { Button } from 'antd'
import Markdown from 'components/markdown'
import createMenuMd from './create-menu.md'
import styles from './style.module.less'

const CreateMenu: React.FunctionComponent = () => {

  // 重置菜单
  const resetMenu = () => {
    ipcRenderer.send('SetupMenu')
  }

  return (
    <div className={styles['create-menu']}>
      <Markdown content={createMenuMd} />
      <Button className={styles['btn-reset-menu']} type='primary' onClick={resetMenu}>撤回</Button>
    </div>
  )
}

export default React.memo(CreateMenu)
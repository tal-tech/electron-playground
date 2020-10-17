import React from 'react'
import Markdown from 'components/markdown'
import trayMd from './tray.md'
import styles from './style.module.less'

function Tray() {

  return (
    <div className={styles['system-tray']}>
      <Markdown content={trayMd} />
    </div>
  )
}

export default React.memo(Tray)
import React, { ReactElement } from 'react'
import styles from './style.module.less'

export default function Frameless(): ReactElement {
  return (
    <div className={styles.frame}>
      <div className={styles.title}>这个是标题</div>
      无边框窗口
    </div>
  )
}

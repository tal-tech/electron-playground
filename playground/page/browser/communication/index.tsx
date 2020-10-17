import React, { ReactElement } from 'react'
import Markdown from 'components/markdown'
import DOC from './markdown/communication.md'
import styles from './style.module.less'

export default function EventEmit(): ReactElement {
  return (
    <div className={styles.container}>
      <Markdown content={DOC} />
    </div>
  )
}

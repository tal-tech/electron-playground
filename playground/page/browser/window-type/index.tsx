import React, { ReactElement } from 'react'
import MarkDown from 'components/markdown'
import DOC from './markdown/windowType.md'

/**
 * 窗口类型
 */
export default function WindowType(): ReactElement {
  return (
    <div>
      <MarkDown content={DOC} />
    </div>
  )
}

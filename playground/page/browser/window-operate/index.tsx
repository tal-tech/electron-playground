import React, { ReactElement } from 'react'
import MarkDown from 'components/markdown'
import DOC from './markdown/window-operate.md'

export default function WindowOperate(): ReactElement {
  return (
    <div>
      <MarkDown content={DOC} />
    </div>
  )
}

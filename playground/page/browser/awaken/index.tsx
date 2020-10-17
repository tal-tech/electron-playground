import React, { ReactElement } from 'react'
import Markdown from 'components/markdown'
import DOC from './markdown/window-awaken.md'

export default function Awaken(): ReactElement {
  return (
    <div>
      <Markdown content={DOC} />
    </div>
  )
}

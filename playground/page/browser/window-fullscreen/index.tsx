import React, { ReactElement } from 'react'
import Markdown from 'components/markdown'
import DOC from './markdown/fullscreen.md'

export default function EventEmit(): ReactElement {
  return (
    <div>
      <Markdown content={DOC} />
    </div>
  )
}

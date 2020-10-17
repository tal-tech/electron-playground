import React, { ReactElement } from 'react'
import MarkDown from 'components/markdown'
import DOC from './markdown/focus-blur.md'

export default function FocusBlur(): ReactElement {
  return (
    <div>
      <MarkDown content={DOC} />
    </div>
  )
}

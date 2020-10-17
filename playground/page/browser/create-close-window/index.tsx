import React, { ReactElement } from 'react'
import Markdown from 'components/markdown'
import DOC from '../../../../../Docs/BrowserWindow/Base/windowOperate.md'

export default function CreateAndClose(): ReactElement {
  return (
    <div>
      <Markdown content={DOC} />
    </div>
  )
}

/* eslint-disable  @typescript-eslint/no-var-requires,react/jsx-no-target-blank */
import React from 'react'
import Markdown from 'components/markdown'
import dialogMd from './dialog.md'

export default () => {
  return (
    <div className='main'>
      <Markdown content={dialogMd} />
    </div>
  )
}

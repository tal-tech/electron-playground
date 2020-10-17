/* eslint-disable  @typescript-eslint/no-var-requires,react/jsx-no-target-blank */
import React from 'react'
import Markdown from 'components/markdown'
import protocolMd from './protocol.md'

export default () => {
  return (
    <div className='main'>
      <Markdown content={protocolMd}/>
    </div>
  )
}

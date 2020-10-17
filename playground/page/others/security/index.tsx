import React from 'react'
import Markdown from 'components/markdown'
import md from './security.md'

interface ISecurityProps {
}

const Security: React.FunctionComponent<ISecurityProps> = props => {
  return <div>
    <Markdown content={md} />
  </div>
}

export default Security

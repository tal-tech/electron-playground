import React from 'react'
import queryString from 'query-string'
import { Image } from 'antd'
 
interface IMarkdownProps {
  src: string // Relative path of the project
}

const CodeRenderer: React.FunctionComponent<IMarkdownProps> = props => {
  const { src } = props
  const parseObj = queryString.parseUrl(src)
  return <Image src={src} {...parseObj.query} />
}

export default CodeRenderer

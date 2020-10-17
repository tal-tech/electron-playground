// 显示代码
import React from 'react'
import './style.less'

interface OpenDocumentProps {
  documentName: string
  url: string
}

export default function OpenDocument(props: OpenDocumentProps) {
  const { documentName, url } = props
  const open = () => {
    window.$EB.openExternal(url)
  }
  return (
    <div className='open-document'>
      <div onClick={open}>查看文档: {documentName} </div>
    </div>
  )
}

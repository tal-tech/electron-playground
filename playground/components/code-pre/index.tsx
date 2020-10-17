// 显示代码
import React from 'react'
import './style.less'
import Highlight from 'react-highlight'
import 'highlight.js'
import 'highlight.js/styles/github.css'

interface CodeProps {
  codeStr: string // 要显示的代码块
  language: 'javascript' | 'css' | 'typescript' | 'markdown' // 代码块的语言类型
  title?: string
}

export default function CodePre(props: CodeProps) {
  const { language, codeStr, title } = props
  return (
    <div className='code_pre'>
      <h3>{title || '调用方式: '}</h3>
      <Highlight className={`language-${language}`}>{codeStr}</Highlight>
    </div>
  )
}

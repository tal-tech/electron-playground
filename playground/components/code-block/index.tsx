/* eslint-disable  global-require,import/no-dynamic-require  */
import * as fs from 'fs'
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { message, Card } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { getSrcRelativePath } from 'utils/path'
import { shell } from 'electron'

import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light'
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml'
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css'

import githubGist from 'react-syntax-highlighter/dist/esm/styles/hljs/github-gist'

import style from './style.module.less'

SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('html', html)
SyntaxHighlighter.registerLanguage('css', css)

export type SupportLanguageType = 'javascript' | 'typescript' | 'css' | 'html' 

interface ICodeBlockProps {
  value?: string
  src?: string // Relative path of the project
  language?: SupportLanguageType
}

const CodeBlock: React.FunctionComponent<ICodeBlockProps> = props => {
  const { value, language, src } = props
  const onCopy = () => message.info('已复制到剪贴板')

  const [code, setCode] = React.useState<string>(value || '')
  const [codePath, setCodePath] = React.useState<string>('')

  React.useEffect(() => {
    if (!src) {
      return
    }
    const codePath = getSrcRelativePath(src)
    setCode('loading ......')
    setCodePath(codePath)
    fs.readFile(codePath, (err, content) => {
      setCode(content.toString())
    })
  }, [src])

  const openFile = (path: string) => {
    shell.openPath(path)
  }

  return (
    <div className={style.container}>
      {codePath && <p>
        代码路径:  <a onClick={openFile.bind(null, codePath)}>{codePath}</a> 
      </p>}
      <SyntaxHighlighter language={language || 'javascript'} style={githubGist} >{code}</SyntaxHighlighter>
      <CopyToClipboard text={code} onCopy={onCopy}>
        <CopyOutlined className={style.copy} />
      </CopyToClipboard>
    </div>
  )
}

export default CodeBlock

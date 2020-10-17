import React, { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import * as fs from 'fs'
import { getSrcRelativePath } from 'utils/path'
import CodeRenderer from './code-renderer'
import ImageRenderer from './image-renderer'
import { HeadRenderer, AnchorRender, handleScroll } from './header-renderer'

import 'github-markdown-css'
import style from './style.module.less'

interface IMarkdownProps {
  content?: string
  src?: string // Relative path of the project
}

const Markdown: React.FunctionComponent<IMarkdownProps> = props => {
  const { content, src } = props
  const [value, setValue] = React.useState<string>(content || '')

  useEffect(() => {
    if (!src) {
      return
    }
    const codePath = getSrcRelativePath(src)
    setValue('loading ......')
    fs.readFile(codePath, (err, content) => {
      setValue(content.toString())
    })
  }, [src])

  return (
    <div className={style['markdown-body']} onScroll={handleScroll}>
      <ReactMarkdown
        className={style.container}
        escapeHtml={false}
        source={value}
        renderers={{
          code: CodeRenderer,
          image: ImageRenderer,
          heading: HeadRenderer,
        }}
      />
      <AnchorRender />
    </div>
  )
}

export default Markdown

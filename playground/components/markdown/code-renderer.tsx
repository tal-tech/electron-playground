import React, { useMemo } from 'react'
import { getSrcRelativePath } from 'utils/path'
import { readFileSync } from 'fs'
import CodeRunner from 'components/code-runner'
import CodeBlock, { SupportLanguageType } from 'components/code-block'

interface ICodeRendererProps {
  language: string
  value: string
}

type rendererType = 'block' | 'runner'

const CodeRenderer: React.FunctionComponent<ICodeRendererProps> = props => {
  const { language, value } = props

  const renderer: rendererType = useMemo(() => {
    const result = value.match(/@@code-renderer:\s*(\w+)/)
    return (result?.[1] as rendererType) || 'block'
  }, [value])

  const contents: string = useMemo(() => {
    const path = value.match(/@@code-path:\s*([/\w./-]+)/)?.[1]

    if (path) {
      try {
        return readFileSync(getSrcRelativePath(path)).toString()
      } catch (error) {
        console.log(error)
        return ''
      }
    } else {
      // 去掉代码中的@@code-*注释
      return value.replace(/.*@@code-.+/g, '').trimStart()
    }
  }, [value])

  const componentProps: { [index: string]: unknown } = useMemo(() => {
    const propsStr = value.match(/@@code-props:\s*(.+)/)?.[1]
    if (!propsStr) return {}
    try {
      let evalProps
      // eslint-disable-next-line
      eval(`evalProps=${propsStr}`)
      if (typeof evalProps !== 'object' || evalProps === null) {
        throw new TypeError(`${evalProps} is not an object`)
      }

      return evalProps
    } catch (error) {
      console.error(error)
      return {}
    }
  }, [value])

  if (renderer === 'runner') {
    return <CodeRunner code={contents} {...componentProps} />
  }

  return (
    <CodeBlock value={contents} language={language as SupportLanguageType} {...componentProps} />
  )
}

export default CodeRenderer

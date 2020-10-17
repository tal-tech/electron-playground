/* eslint-disable no-var ,no-new-func */
import React, { useState, useRef } from 'react'
// import Editor from 'react-ace'
import { message } from 'antd'
import * as fs from 'fs'
import { randomId } from 'utils/id'
import { getSrcRelativePath } from 'utils/path'
import util from 'util'
import { clipboard } from 'electron'

import MonacoEditor from '../monaco-editor'
import EditorToolbar from './editor-toolbar'

import style from './style.module.less'

declare var __webpack_require__: Function
declare var __non_webpack_require__: Function
const nativeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

interface ICodeRunnerProps {
  code?: string
  src?: string // Relative path of the project
  height?: string
  mProcess?: boolean
}

type LogType = 'log' | 'error' | 'warn' | 'info' | 'debug'

export interface LogItem {
  type: LogType
  content: string
}

// eslint-disable-next-line max-lines-per-function
const CodeRunner: React.FunctionComponent<ICodeRunnerProps> = props => {
  // const id = useMemo(() => randomId(), [])
  const id = useRef(randomId())

  const { code, src, height = '500px', mProcess = true } = props
  const [value, setValue] = React.useState<string>(code || '')
  const [stdout, setStdout] = useState<string>('')
  const [codePath, setCodePath] = React.useState<string>('')

  React.useEffect(() => {
    if (!src) {
      return
    }
    const codePath = getSrcRelativePath(src)
    setValue('loading ......')
    setCodePath(codePath)
    fs.readFile(codePath, (err, content) => {
      setValue(content.toString())
    })
  }, [src])

  const onChange = (e: string) => {
    setValue(e)
  }

  const executeMasterProcess = () => {
    try {
      const result = window.$EB.actionCode(value, id.current)
      const out = result.reduce((prev: LogItem, curr: LogItem) => `${prev}${curr.content}\n`, '')
      setStdout(out)
      // 处理console
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.$EB.ipcRenderer.on('ACTION_CODE_LOG', (...args: any[]) => {
        const res = args[1]
        if (res[0].id === id.current) {
          const out = res.reduce((prev: LogItem, curr: LogItem) => `${prev}${curr.content}\n`, '')
          setStdout(out)
        }
      })
    } catch (error) {
      console.error('执行错误', error)
    }
  }

  const executeRenderProcess = () => {
    // 拦截log

    const print = (...args: unknown[]) => {
      if (!args.length) {
        return
      }
      const content = args.reduce(
        (prev, curr) => prev + util.inspect(curr, { showHidden: true }),
        '',
      ) as string
      setStdout(content)
    }
    const MockConsole = {
      log: print,
      error: print,
      warn: print,
      info: print,
      debug: print,
    }

    const fn = new Function(
      'require',
      'console',
      `return function(){
            try{
              ${value}
            }catch(error){
              console.error('程序执行错误',error)
            }
           }`,
    )(nativeRequire, MockConsole)
    const result = fn()
    if (result) {
      MockConsole.log(result)
    }
  }

  const copy = (text: string) => {
    console.log('???', text)
    clipboard.writeText(text)
    message.info('已复制到剪贴板')
  }

  return (
    <div className={style.container}>
      {codePath && <p>代码路径: {codePath}</p>}
      <main>
        <div className={style.editor}>
          <MonacoEditor code={code || ''} language='javascript' onChange={onChange} />
          <EditorToolbar
            tools={[
              { type: 'run', onClick: mProcess ? executeMasterProcess : executeRenderProcess },
              { type: 'copy', onClick: () => copy(value) },
            ]}
          />
        </div>
        {stdout && (
          <div className={style.output}>
            <MonacoEditor
              key={`console-${stdout}`}
              code={stdout}
              language='javascript'
              options={{ readOnly: true }}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default CodeRunner

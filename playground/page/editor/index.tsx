/* eslint-disable quotes */
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Mosaic, MosaicWindow, MosaicZeroState, MosaicNode } from 'react-mosaic-component'
import MonacoEditor from 'components/monaco-editor'
import Title from './editor-operate'

import 'react-mosaic-component/react-mosaic-component.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

import styles from './style.module.less'
import { saveToTemp, Files, execute, getFiles, ChildProcess } from './utils'

const defaultOptions = {
  scrollbar: { alwaysConsumeMouseWheel: true },
  scrollBeyondLastLine: true,
}

interface WrapEditorProps {
  code: string
  language: string
  onChange: (str: string) => void
}

export enum EditorId {
  'main.js' = 'main.js',
  'renderer.js' = 'renderer.js',
  'index.html' = 'index.html',
  'preload.js' = 'preload.js',
}

export const TitleMAP = {
  'main.js': '主进程代码',
  'renderer.js': '渲染进程代码',
  'index.html': '窗口HTML',
  'preload.js': 'preload.js代码',
}

const LangMAP = {
  'main.js': 'javascript',
  'renderer.js': 'javascript',
  'index.html': 'html',
  'preload.js': 'javascript',
}

export const DEFAULT_MOSAIC_ARRANGEMENT: MosaicNode<EditorId> = {
  direction: 'row',
  first: {
    direction: 'column',
    first: EditorId['main.js'],
    second: EditorId['preload.js'],
  },
  second: {
    direction: 'column',
    first: EditorId['renderer.js'],
    second: EditorId['index.html'],
  },
}

const WrapEditor = function ({ code, language, onChange }: WrapEditorProps) {
  return (
    <MonacoEditor
      code={code}
      options={defaultOptions}
      language={language}
      height='100vh'
      onChange={onChange}
    />
  )
}

const EditorWindow = function () {
  const [layout, setLayout] = useState<MosaicNode<EditorId>>(DEFAULT_MOSAIC_ARRANGEMENT)
  const [editorFiles, setEditorFiles] = useState<Files>()

  const initFiles = async () => {
    const files = await getFiles()
    setEditorFiles(files)
  }

  const handleLayoutChange = (layoutProp: MosaicNode<EditorId> | null) => {
    if (layoutProp) {
      setLayout(layoutProp)
    }
  }

  const handleExec = async (): Promise<ChildProcess | null> => {
    if (editorFiles) {
      await saveToTemp(editorFiles)
      const child = await execute()
      return child
    }
    return null
  }

  const handelEditorChange = (flag: string) => {
    return (val: string) => {
      setEditorFiles(editorFiles => ({ ...editorFiles, [flag]: val }))
    }
  }

  useEffect(() => {
    initFiles()
  }, [])

  if (!editorFiles) return null

  return (
    <div className={styles.wrapper}>
      <Title handleExec={handleExec} layout={layout} setLayout={setLayout} />
      <div className={styles.editor}>
        <Mosaic<EditorId>
          renderTile={(count, path) => (
            <MosaicWindow<EditorId> title={count} path={path}>
              <WrapEditor
                code={editorFiles[count] as string}
                language={LangMAP[count]}
                onChange={handelEditorChange(count)}
              />
            </MosaicWindow>
          )}
          onChange={handleLayoutChange}
          value={layout}
          zeroStateView={<MosaicZeroState />}
        />
      </div>
    </div>
  )
}

export default EditorWindow

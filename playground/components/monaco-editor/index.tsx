import React, { useRef, useEffect } from 'react'
import { editor as MonacoEditor, languages } from 'monaco-editor'
import { getModulesSource } from './utils'

export interface EditorProps {
  code: string
  language?: string
  height?: number | string
  options?: MonacoEditor.IStandaloneEditorConstructionOptions
  onChange?: (val: string, event: MonacoEditor.IModelContentChangedEvent) => void
}

const defaultOptions: MonacoEditor.IStandaloneEditorConstructionOptions = {
  theme: 'vs',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  scrollbar: { alwaysConsumeMouseWheel: false },
  automaticLayout: true,
}

const CodeEditor = ({
  code,
  height: heightProps,
  language = 'javascript',
  options = {},
  onChange = console.log,
}: EditorProps) => {
  const container = useRef<HTMLDivElement>(null)
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor>(null)
  const prevHeight = useRef<number>(0)

  const addModules = async () => {
    // 需要加载到编辑器中的modules
    const libSourcePromise = await getModulesSource()
    const libSourceArr = await Promise.all(libSourcePromise)

    // 这里会返回移除库的方法
    libSourceArr.forEach(item => languages.typescript.javascriptDefaults.addExtraLib(item || ''))
  }

  const updateEditorHeight = () => {
    const editor = editorRef.current
    if (heightProps || !editor) return

    const editorElement = editor.getDomNode()
    if (!editorElement) {
      return
    }

    const lineHeight = editor.getOption(MonacoEditor.EditorOption.lineHeight)
    const lineCount = editor.getModel()?.getLineCount() || 1
    const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight

    if (prevHeight.current !== height) {
      prevHeight.current = height
      editorElement.style.height = `${height + 10}px`
      editor.layout()
    }
  }

  // 初始化
  const initMonaco = () => {
    const containerDom = container.current
    if (containerDom) {
      const editor: MonacoEditor.IStandaloneCodeEditor = MonacoEditor.create(containerDom, {
        value: code,
        language,
        ...defaultOptions,
        ...options,
      })
      // @ts-ignore
      editorRef.current = editor
      editor.onDidChangeModelContent((event: MonacoEditor.IModelContentChangedEvent) => {
        onChange && onChange(editor.getValue(), event)
        updateEditorHeight() // typing
        requestAnimationFrame(updateEditorHeight) // folding
      })

      addModules()
    }
  }

  useEffect(() => {
    initMonaco()
    updateEditorHeight()
    return () => {
      editorRef.current?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={container} style={{ width: '100%', height: heightProps }} />
}

export default CodeEditor

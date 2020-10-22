import React, { useMemo, ReactElement, MouseEvent } from 'react'
import { Button } from 'antd'
import { CopyOutlined, CaretRightOutlined } from '@ant-design/icons'

import { getSrcRelativePath } from 'utils/path'
import styles from './style.module.less'

const toolTypes = ['copy', 'run'] as const

type toolType = typeof toolTypes[number]
type tool = { type: toolType; icon?: ReactElement; onClick?(): void; text?: string }

interface IEditorToolbarProps {
  tools: tool[]
  style?: React.CSSProperties
}

const iconMap = new Map<toolType, Omit<tool, 'type'>>()
iconMap.set('copy', { icon: <CopyOutlined />, text: '复制' })
iconMap.set('run', { icon: <CaretRightOutlined />, text: '试一试' })

const EditorToolbar: React.FunctionComponent<IEditorToolbarProps> = props => {
  const { tools, style } = props

  const ToolItems = useMemo(() => {
    if (!tools?.length) return null
    const items: ReactElement[] = []
    tools.forEach((tool, index) => {
      const { icon, text, onClick } = { ...iconMap.get(tool.type), ...tool }

      items.push(
        <div onClick={onClick} className={styles.item} key={index}>
          {icon}
          <span>{text}</span>
        </div>,
      )
    })
    return items
  }, [tools])

  const handleOpenEditor = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    window.$EB.openWindow('#/editor', { width: 1400, height: 800 })
  }

  return (
    <div className={styles.container} style={style}>
      <div className={styles.btn}>{ToolItems}</div>
      {/* TODO: 后续添加完整例子，将从这进入编辑器 */}
      <Button size='small' type='link' onClick={handleOpenEditor}>
        完整项目示例
      </Button>
    </div>
  )
}

export default EditorToolbar

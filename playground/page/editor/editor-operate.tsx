/* eslint-disable  react/jsx-curly-brace-presence */
import React, { ReactElement, useState, useRef } from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { MosaicNode } from 'react-mosaic-component'
import {
  CaretRightOutlined,
  FileTextOutlined,
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons'

import { ChildProcess, createMosaicArrangement, getVisibleMosaics } from './utils'
import styles from './style.module.less'
import { EditorId } from '.'

interface IProp {
  handleExec: () => Promise<ChildProcess | null>
  layout: MosaicNode<EditorId>
  setLayout: (layout: MosaicNode<EditorId>) => void
}

interface MProp {
  layout: MosaicNode<EditorId>
  setLayout: (layout: MosaicNode<EditorId>) => void
}

const WrapMenu = function ({ layout, setLayout }: MProp) {
  const visibleMosaics = getVisibleMosaics(layout)
  const menuItem = ['main.js', 'renderer.js', 'index.html', 'preload.js']

  const onItemClick = (str: string) => {
    return () => {
      let newMosaicsArrangement: Array<EditorId>

      if (visibleMosaics.includes(str as EditorId)) {
        newMosaicsArrangement = visibleMosaics.filter(i => i !== str)
      } else {
        newMosaicsArrangement = [...visibleMosaics, str as EditorId]
      }
      setLayout(createMosaicArrangement(newMosaicsArrangement))
    }
  }

  return (
    <Menu>
      {menuItem.map(item => (
        <Menu.Item
          key={item}
          onClick={onItemClick(item)}
          id={item}
          icon={
            visibleMosaics.includes(item as EditorId) ? <EyeOutlined /> : <EyeInvisibleOutlined />
          }>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  )
}

export default function EditorOperate({ handleExec, setLayout, layout }: IProp): ReactElement {
  const [exec, setExec] = useState<'RUN' | 'STOP'>('RUN')

  const childRef = useRef<ChildProcess>()

  const wrapExec = async () => {
    if (childRef.current) {
      childRef.current.kill()
      // @ts-ignore
      childRef.current = null
    } else {
      const child = await handleExec()
      // @ts-ignore
      childRef.current = child
      setExec('STOP')
      child?.on('close', code => {
        setExec('RUN')
      })
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        <Button disabled size='small' icon={<FileTextOutlined />}>
          Electron v{process.versions.electron}
        </Button>
        <Button
          size='small'
          onClick={wrapExec}
          icon={exec === 'RUN' ? <CaretRightOutlined /> : <LoadingOutlined />}>
          {exec}
        </Button>
      </div>
      <div className='editors'>
        <Dropdown overlay={<WrapMenu layout={layout} setLayout={setLayout} />}>
          <Button size='small' icon={<FileTextOutlined />}>
            Editors
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

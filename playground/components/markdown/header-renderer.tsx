/* eslint-disable indent,@typescript-eslint/indent */
import React, { useEffect, useRef, useState } from 'react'
import { Anchor, Drawer } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import style from './style.module.less'

const { Link } = Anchor

interface IMarkdownProps {
  level: number
}

let TOC: any[] = []

function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
  // @ts-ignore
  // TODO: 后续可做锚点追踪
}

function getElementTop(element: HTMLElement) {
  let actualTop = element.offsetTop
  let current = element.offsetParent

  while (current !== null) {
    // @ts-ignore
    actualTop += current.offsetTop
    // @ts-ignore
    current = current.offsetParent
  }

  return actualTop
}

const HeadRenderer: React.FunctionComponent<IMarkdownProps> = props => {
  const { children } = props
  const { level, ...otherProps } = props

  const ref = useRef<HTMLElement>(null)
  const id = children
    ? children
        .valueOf()
        // @ts-ignore
        .map(item => item.props.value)
        .join('')
    : ''

  useEffect(() => {
    if (ref.current) {
      const top = getElementTop(ref.current)
      TOC.push({ level, content: id, top })
    }
  }, [id, level])

  return React.createElement(`h${level}`, { id, ...otherProps, ref })
}

const AnchorRender = () => {
  const [show, setShow] = useState<boolean>(false)
  useEffect(() => {
    return () => {
      TOC = []
    }
  }, [])

  const handleAnchor = (
    e: React.MouseEvent<HTMLElement>,
    link: { title: React.ReactNode; href: string },
  ) => {
    const dom = document.getElementById(link.href)
    if (dom) {
      dom.scrollIntoView({ behavior: 'smooth' })
      dom.scrollTop -= 60
    }
    e.preventDefault()
  }

  return (
    <>
      <div className={style.contents} onMouseOver={() => setShow(true)}>
        <LeftOutlined className={style.icon} />
        目录
      </div>

      <Drawer title={null} placement='right' closable={false} mask={false} visible={show}>
        <div onMouseLeave={() => setShow(false)} style={{height:'100%'}}>
          <Anchor onClick={handleAnchor} bounds={0}>
            {TOC.map(({ content, level }) => (
              <div key={content} style={{ marginLeft: (level - 1) * 10 }}>
                <Link href={content} title={content} key={content} />
              </div>
            ))}
          </Anchor>
        </div>
      </Drawer>
    </>
  )
}

export { HeadRenderer, AnchorRender, handleScroll }

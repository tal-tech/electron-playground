import React, { useRef, useEffect } from 'react'
import style from './style.module.less'

interface IMessageBoxProps {
  title?: string
  messages: string[]
}

const MessageBox: React.FunctionComponent<IMessageBoxProps> = props => {
  const { title, messages = [] } = props
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(!contentRef.current) return
    contentRef.current.scrollTo({top: contentRef.current.scrollHeight, behavior: 'smooth'})
  },[messages.length])

  return (
    <div className={style['message-box']}>
      {title && <div className={style['box-title']}>{title}</div>}
      <div ref={contentRef} className={style['box-content']}>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>
    </div>
  )
}

export default MessageBox

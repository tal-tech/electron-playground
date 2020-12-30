import React, { ReactElement, useEffect } from 'react'
import style from '../style.module.less'

export default function Communication(): ReactElement {

  useEffect(() => {
    document.title = '父窗口'
  }, [])

  return (
    <div className={style.wrap}>
      <a href='http://www.github.com' target='__blank'>
        通过a标签target=__blank打开新的窗口
      </a>
      <div
        onClick={() => {
          window.open('http://www.github.com')
        }}>
        通过window.open打开新的窗口
      </div>
    </div>
  )
}

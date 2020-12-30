import React, { ReactElement, useState } from 'react'
import styles from '../style.module.less'

function fullScreen() {
  const element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
    // @ts-ignore
  } else if (element.msRequestFullscreen) {
    // @ts-ignore
    element.msRequestFullscreen()
    // @ts-ignore
  } else if (element.mozRequestFullScreen) {
    // @ts-ignore
    element.mozRequestFullScreen()
    // @ts-ignore
  } else if (element.webkitRequestFullscreen) {
    // @ts-ignore
    element.webkitRequestFullscreen()
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    // @ts-ignore
    document.msExitFullscreen()
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen()
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore
    document.webkitExitFullscreen()
  }
}

function isFull(): boolean {
  // @ts-ignore
  const { webkitIsFullScreen, mozFullScreen, msFullscreenElement, fullscreenElement } = document
  return !!(webkitIsFullScreen || mozFullScreen || msFullscreenElement || fullscreenElement)
}

export default function FullScreen(): ReactElement {
  const [text, setText] = useState<'全屏' | '退出全屏'>('全屏')

  const handleFullScreen = () => {
    const flag = isFull()
    setText(flag ? '全屏' : '退出全屏')
    return flag ? exitFullscreen() : fullScreen()
  }

  const handleClick = () => {
    // @ts-ignore
    const { setFullScreen, isFullScreen } = window
    setFullScreen(!isFullScreen())
  }

  return (
    <div className={styles['full-screen']}>
      <h3>全屏和恢复的示例窗口</h3>
      <div onClick={handleFullScreen} className={styles.btn}>
        {text}(通过HTML api 实现的按钮)
      </div>

      <div onClick={handleClick} className={styles.btn}>
        {text}(通过 window.setFullScreen 实现的按钮)
      </div>
    </div>
  )
}

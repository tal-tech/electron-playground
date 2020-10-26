import React, { ReactElement, useEffect, useState } from 'react'
import style from '../style.module.less'

const COUNT_NUM = 5

export default function Communication(): ReactElement {
  const [num, setNum] = useState(COUNT_NUM)

  useEffect(() => {
    document.title = '子窗口'
    // eslint-disable-next-line jsx-control-statements/jsx-jcs-no-undef
    let timer: NodeJS.Timeout

    if (num > 0) {
      timer = setTimeout(() => {
        setNum(num - 1)
      }, 1000)
    } else {
      // @ts-ignore
      window.send('hello')
      window.close()
    }
    return () => {
      timer && clearTimeout(timer)
    }
  }, [num])

  return <div className={style.countDown}>子窗口 {num} 秒之后，请看主窗口</div>
}

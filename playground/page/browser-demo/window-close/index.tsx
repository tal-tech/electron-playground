import React, { ReactElement, useState, useEffect } from 'react'
import styles from '../style.module.less'

export default function BeforeCloseModalDemo(): ReactElement {
  const [show, setShow] = useState<boolean>(false)

  const beforeUnload = (e: BeforeUnloadEvent) => {
    setShow(true)
    e.returnValue = false
  }

  const onCancel = () => {
    setShow(false)
  }

  const onOk = () => {
    window.onbeforeunload = null
    window.close()
    // setShow(true)
  }
  useEffect(() => {
    window.onbeforeunload = beforeUnload
    return () => {
      window.onbeforeunload = null
    }
  }, [])

  return (
    <div className={styles.close}>
      <h3>关闭这个窗口之前，会出现弹窗。</h3>
      {show && (
        <div className={styles.model}>
          <div className={styles.content}>Do you really want to leave?</div>

          <img
            src='https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1297937920,2807167311&fm=26&gp=0.jpg'
            alt=''
          />
          <div className={styles.confirm}>
            <div className={styles.ok} onClick={onOk}>
              YES!
            </div>
            <div className={styles.cancel} onClick={onCancel}>
              NO!
            </div>
            {/* <div className={styles.bg} /> */}
          </div>
        </div>
      )}
    </div>
  )
}

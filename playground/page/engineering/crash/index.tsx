/* eslint-disable  @typescript-eslint/no-var-requires,react/jsx-no-target-blank,import/no-webpack-loader-syntax */
import React from 'react'
import path from 'path'
import { Button } from 'antd'
import CodeRunner from 'components/code-block'

import style from './style.module.less'

const Sentry = require('./sentry.png')

export default () => {
  const errorMain = () => {
    window.$EB.ipcRenderer.send('renderer.error', {
      message: 'renderer.error',
    })
  }

  const errorRenderer = () => {
    throw new Error('Error triggered in renderer process')
  }

  const crashRenderer = () => {
    window.$EB.crash()
  }
  return (
    <div>
      <code> 代码路径：{path.resolve(__filename)} </code>

      <p>
        开发electron项目时，经常会遇到APP崩溃的情况，如果APP端没有对应的日志记录，那开发就无法掌握APP的崩溃情况了，也不好做分析。
      </p>
      <p>
        目前我们选用的是开源项目
        <a href='https://sentry.io' target='_blank'>
          Sentry
        </a>
        ,它用来记录crash日志，它也有统计模块，也能私有化部署，基本上开箱就能用
      </p>

      <img src={Sentry} alt='Sentry' height='125' />

      <div>
        <h3>情况模拟</h3>
        <div className={style['case-simulation']}>
          <div>
            <Button type='primary' onClick={errorMain}>
              Renderer进程主动push错误信息
            </Button>
            <p>
              触发的
              <a
                href='https://sentry.io/share/issue/76069b04b4aa4cc0ba99c2e74fceb8fc/'
                target='_blank'>
                sentry 错误日志(可能需要翻墙)
              </a>{' '}
            </p>
          </div>
          <div>
            <Button type='primary' onClick={errorRenderer}>
              Renderer进程被动触发错误信息
            </Button>
            <p>这不会触发sentry信息</p>
          </div>
          <div>
            <Button type='primary' onClick={crashRenderer}>
              Renderer进程crash了
            </Button>
            <p>
              触发的
              <a
                href='https://sentry.io/share/issue/05a5ec366a194f36b2293b453cdec25c/'
                target='_blank'>
                sentry crash日志(可能需要翻墙)
              </a>{' '}
            </p>
          </div>
        </div>
      </div>
      <p>实现上述功能，需要两步</p>
      <p>1. App启动时，/app/collect/sentry.ts</p>
      <p>2. createBrowserWindow时，把addCrashListener引用下</p>
      <p>以下是核心代码</p>
      <CodeRunner src='/app/collect/sentry.ts' language='typescript' />
    </div>
  )
}

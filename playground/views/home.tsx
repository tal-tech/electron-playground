import React, { useMemo } from 'react'
import { Layout } from 'antd'
import { useLocation } from 'react-router-dom'

import Menu from './menu'
import Route, { isolatedRoutes } from './route'

import style from './home.module.less'

export default function Home() {
  const { pathname } = useLocation()

  const isolated = useMemo(() => isolatedRoutes.includes(pathname), [pathname])

  return (
    <Layout className={style.container}>
      {!isolated && (
        <Layout.Sider width={256}>
          <Menu />
        </Layout.Sider>
      )}
      <Layout className={isolated ? '' : style.main}>
        <Layout.Content className={isolated ? '' : style.content}>
          <Route />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

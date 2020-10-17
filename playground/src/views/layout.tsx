import React from 'react'
import { Scope, configureScope } from '@sentry/electron'
import { init } from '@sentry/electron/dist/renderer'
import Menu from './menu'
import Route from './route'
import Footer from './footer'

import './layout.less'

export default class Layout extends React.Component<{}, {}> {
  componentDidMount() {
    // https://docs.sentry.io/enriching-error-data/additional-data/
    configureScope((scope: Scope) => {
      // Users are applied to construct a unique identity in Sentry.
      scope.setUser({ id: window.$EB.machineId })
    })
    // Initialize the sentry
    init({
      dsn: process.env.SENTRY_DSN,
      debug: process.env.ENV_TYPE !== 'prod',
    })
  }

  // componentDidCatch(error, errorInfo) {

  // }

  render() {
    return (
      <div className='layout'>
        <div className='menu'>
          <Menu />
        </div>
        <div className='components'>
          <div className='components-contain'>
            <Route />
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

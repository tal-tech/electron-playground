import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/home'

export default function () {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

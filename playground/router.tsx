import React,{lazy,Suspense} from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

export default function router() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/demo/communication-part1/client" component={lazy(() => import('./page/browser-demo/communication-part1/client'))} />
          <Route path="/demo/communication-part1/main" component={lazy(() => import('./page/browser-demo/communication-part1/main'))} />
          <Route path="/demo/communication-part2/client" component={lazy(() => import('./page/browser-demo/communication-part2/client'))} />
          <Route path="/demo/communication-part2/main" component={lazy(() => import('./page/browser-demo/communication-part2/main'))} />
          <Route path="/demo/communication-part3/client" component={lazy(() => import('./page/browser-demo/communication-part3/client'))} />
          <Route path="/demo/communication-part3/main" component={lazy(() => import('./page/browser-demo/communication-part3/main'))} />
          <Route path="/demo/window-close" component={lazy(() => import('./page/browser-demo/window-close'))} />
          <Route path="/demo/window-type" component={lazy(() => import('./page/browser-demo/demo-window-type'))} />
          <Route path="/demo/full-screen" component={lazy(() => import('./page/browser-demo/full-screen'))} />

          <Route path="/editor" component={lazy(() => import('./page/editor'))} />
          <Route path="/download-manager/demo" component={lazy(() => import('./page/download-manager'))} />
          <Route path="/start" component={lazy(() => import('./page/start'))} />
          <Route path="/apidoc" component={lazy(() => import('./page/apidoc'))} />
        </Switch>
      </Suspense>
    </Router>
  )
}

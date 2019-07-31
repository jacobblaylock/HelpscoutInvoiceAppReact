import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from './Header'
import Main from './Main'

const Landing = () => <h2>Welcome.  You will need your Helpscout credentials.</h2>
const LoginFailed = () => <h2 style={{ color: 'red' }}>Authorization Failed.  Please Login Again</h2>

const App = () => {
  return (
    <div>
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/loginFailed' component={LoginFailed} />
          <Route exact path='/main' component={Main} />
        </Switch>
      </div>
    </div>
  )
}

export default App
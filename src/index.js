import React, { useState } from 'react'
import { render } from 'react-dom'
import { useGetIdea, useWhat } from './hooks'
import { SWRConfig } from 'swr'
import { BrowserRouter as Router, NavLink, Route, Switch } from 'react-router-dom'
import { InspireYourWife } from './components'

export const App = props => {
  return <Router>
    <nav>
      <NavLink to='/inspire-your-wife'>Inspire Your Wife</NavLink>
    </nav>
    <Switch>
      <Route path='/inspire-your-wife'>
        <InspireYourWife />
      </Route>
      <Route path='/'>
        <h1>Home!</h1>
      </Route>
    </Switch>
  </Router>
}

render(
  <SWRConfig
    value={{
      refreshInterval: 0,
      fetcher: (...args) => fetch(...args).then(res => res.json())
    }}
  >
    <App />
  </SWRConfig>,
  document.getElementById('app')
)

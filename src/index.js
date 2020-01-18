import React, { useState } from 'react'
import { render } from 'react-dom'
import { useGetIdea, useWhat } from './hooks'
import { SWRConfig } from 'swr'
import { BrowserRouter as Router, NavLink, Route, Switch } from 'react-router-dom'
import { InspireYourWife, Home } from './components'

const navClass = 'px-4 h-full flex-center'
const activeNavClass = 'bg-green-500'

export const App = props => {
  return <Router>
    <nav className='sticky top-0 bg-green-400 text-gray-700 h-12 flex items-center'>
      <NavLink className={navClass} activeClassName={activeNavClass} exact to='/'>Home</NavLink>
      <NavLink className={navClass} activeClassName={activeNavClass} to='/inspire-your-wife'>Inspire Your Wife</NavLink>
    </nav>
    <Switch>
      <Route path='/inspire-your-wife'>
        <InspireYourWife />
      </Route>
      <Route exact path='/'>
        <Home />
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

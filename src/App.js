import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

// style
import "./App.css"

// screens
import Demo from "./screens/Demo"
import Landing from "./screens/Landing"

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Landing />
        </Route>
        {/* página de demonstração de componentes */}
        <Router path='/demo'>
          <Demo />
        </Router>
      </Switch>
    </Router>
  )
}

export default App

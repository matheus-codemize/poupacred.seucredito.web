import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Lading';
import Login from './pages/Login';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={() => <Landing />} />
      <Route path="/login" component={() => <Login />} />
    </Switch>
  </BrowserRouter>
);

export default Routes;

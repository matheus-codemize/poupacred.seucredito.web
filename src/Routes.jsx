import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Lading';
import Login from './pages/Login';
import Form from './pages/Form';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={() => <Landing />} />
      <Route path="/login" component={() => <Login />} />
      <Route path="/Form" component={() => <Form />} />
    </Switch>
  </BrowserRouter>
);

export default Routes;

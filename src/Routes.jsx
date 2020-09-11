import React, { useContext, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Lading';
import Login from './pages/Login';
import Form from './pages/Form';
import Crm from './pages/Crm';
import Sidebar from './components/Sidebar';
import Proposal from './pages/Proposal';
function Routes() {
  const [logged, setLogged] = useState(false);
  const privateRoutes = [
    {
      path: '/crm',
      main: function render() {
        return <Crm />;
      },
    },
    {
      path: '/propostas',
      main: function render() {
        return <Proposal />;
      },
    },
  ];
  // return <Sidebar routes={privateRoutes} />;

  // se usuario nao estiver logado deve acessar apenas as seguintes rotas
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={() => <Landing />} />
        <Route path="/login" component={() => <Login />} />
        <Route path="/form" component={() => <Form />} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;

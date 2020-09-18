import React, { useMemo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Form from './pages/Form';
import Crm from './pages/Crm';
import Proposal from './pages/Proposal';

// components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function Routes() {
  const { isAuthenticated } = useSelector(state => state.auth);

  const render = useMemo(() => {
    if (isAuthenticated) {
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
      return <Sidebar routes={privateRoutes} />;
    }
    return (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={() => <Landing />} />
          <Route path="/login" component={() => <Login />} />
          <Route path="/cadastro-agente" component={() => <Form />} />
        </Switch>
      </BrowserRouter>
    );
  }, [isAuthenticated]);

  return render;
}

export default Routes;

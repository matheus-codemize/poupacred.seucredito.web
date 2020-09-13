import React, { useMemo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Landing from './pages/Lading';
import Login from './pages/Login';
import Form from './pages/Form';
import Crm from './pages/Crm';
import Sidebar from './components/Sidebar';
import Proposal from './pages/Proposal';
function Routes() {
  const { isAuthenticated } = useSelector(state => state.auth);
  // const publicRoutesMemo = useMemo(
  //   () => (
  //     <BrowserRouter>
  //       <Switch>
  //         <Route exact path="/" component={() => <Landing />} />
  //         <Route path="/login" component={() => <Login />} />
  //         <Route path="/form" component={() => <Form />} />
  //       </Switch>
  //     </BrowserRouter>
  //   ),
  //   [],
  // );

  // const privateRoutesMemo = useMemo(() => {
  //   const privateRoutes = [
  //     {
  //       path: '/crm',
  //       main: function render() {
  //         return <Crm />;
  //       },
  //     },
  //     {
  //       path: '/propostas',
  //       main: function render() {
  //         return <Proposal />;
  //       },
  //     },
  //   ];
  //   return <Sidebar routes={privateRoutes} />;
  // }, []);

  const render = useMemo(() => {
    console.log('memo');
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
        <Switch>
          <Route exact path="/" component={() => <Landing />} />
          <Route path="/login" component={() => <Login />} />
          <Route path="/form" component={() => <Form />} />
        </Switch>
      </BrowserRouter>
    );
  }, [isAuthenticated]);

  // se usuario nao estiver logado deve acessar apenas as seguintes rotas
  return render;
}

export default Routes;

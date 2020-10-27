import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

// redux
import actionsNavigator from './redux/actions/navigator';

// component toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BoxHelp from './components/BoxHelp';
import Container from './components/Container';
import SelectList from './components/SelectList';
import HeaderUser from './components/HeaderUser';

// pages
import Crm from './pages/Crm';
import Home from './pages/Home';
import Proposal from './pages/Proposal';
import Simulation from './pages/Simulation';

import Login from './pages/Login';
import Landing from './pages/Landing';
import Success from './pages/Success';
import RegisterAgent from './pages/RegisterAgent';
import RegisterClient from './pages/RegisterClient';

// resources
import { routesAgent, routesClient } from './resources/data/sidebar/routes';

const pages = {
  Crm,
  Home,
  Proposal,
  Simulation,
};

function App() {
  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);

  // component state
  const [routes, setRoutes] = useState([]);

  /**
   * esse efeito tem por objetivo salvar no redux o tamanho da tela
   */
  const windowResize = useCallback(() => {
    const { innerHeight, innerWidth } = window;
    dispatch(actionsNavigator.windowSize({ y: innerHeight, x: innerWidth }));
  }, [window, window.innerHeight, window.innerWidth]);

  useEffect(() => {
    windowResize();
    window.addEventListener('load', windowResize);
    window.addEventListener('resize', windowResize);
    window.addEventListener('scroll', windowResize);

    return () => {
      window.removeEventListener('load', windowResize);
      window.removeEventListener('resize', windowResize);
      window.removeEventListener('scroll', windowResize);
    };
  }, [windowResize]);

  /**
   * esse efeito tem por objetivo salvar no redux o tipo de aparelho usado
   * type: one of ['mobile', 'desktop']
   */
  useEffect(() => {
    let type = 'desktop';

    if (navigator.userAgent.toLowerCase().includes('mobile')) {
      type = 'mobile';
    }
    dispatch(actionsNavigator.navigatorType(type));
  }, [navigator, navigator.userAgent]);

  useEffect(() => {
    switch (auth.type) {
      case 'client':
        setRoutes([...routesClient]);
        break;

      case 'agent':
        setRoutes([...routesAgent]);
        break;

      default:
        setRoutes([]);
        break;
    }
  }, [auth, auth.type]);

  return (
    <Router>
      <Container />
      {routes.length > 0 && <Sidebar />}
      {!routes.length ? <Header /> : <HeaderUser />}
      <BoxHelp />
      <SelectList />
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/success">
          <Success />
        </Route>
        <Route exact path="/register/agent">
          <RegisterAgent />
        </Route>
        <Route exact path="/register/client">
          <RegisterClient />
        </Route>
        <Route path="/login">
          {auth.uid && !auth.primeiro_acesso ? (
            <Redirect push from="/login" to="/home" />
          ) : (
            <Login />
          )}
        </Route>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            component={pages[route.component]}
          />
        ))}
      </Switch>
      <ToastContainer />
    </Router>
  );
}

export default App;

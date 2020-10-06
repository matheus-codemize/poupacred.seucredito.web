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
import Container from './components/Container';

// pages
import Home from './pages/Home';
import Login from './pages/Login';
import Proposal from './pages/Proposal';
import Landing from './pages/Landing';
import Success from './pages/Success';
import RegisterAgent from './pages/RegisterAgent';
import RegisterClient from './pages/RegisterClient';

// pages others versions
import Home1 from './pages/Home1';
import Home2 from './pages/Home2';
import Home3 from './pages/Home3';

// resources
import { routesAgent, routesClient } from './resources/data/sidebar/routes';

const pages = {
  Home,
  Proposal,
  Home1,
  Home2,
  Home3,
};

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

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
    window.addEventListener('resize', windowResize);
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
      <Header />
      {routes.length > 0 && <Sidebar />}
      <Container />
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

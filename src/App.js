import React, { useCallback, useEffect, useMemo } from 'react';
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
import Chat from './components/Chat';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BoxHelp from './components/BoxHelp';
import Container from './components/Container';
import SelectList from './components/SelectList';
import HeaderUser from './components/HeaderUser';
import PanelAction from './components/PanelAction';

// pages
import Crm from './pages/Crm';
import Home from './pages/Home';
import Proposal from './pages/Proposal';
import Simulation from './pages/Simulation';

import Login from './pages/Login';
import Report from './pages/Report';
import Landing from './pages/Landing';
import Success from './pages/Success';
import Notification from './pages/Notification';
import RegisterAgent from './pages/RegisterAgent';
import RegisterClient from './pages/RegisterClient';

// resources
import { routesAgent, routesClient } from './resources/data/sidebar/routes';

const pages = {
  Crm,
  Home,
  Proposal,
};

function App() {
  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);

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

  const routes = useMemo(() => {
    return auth.type === 'agent'
      ? routesAgent
      : auth.type === 'client'
      ? routesClient
      : [];
  }, [auth.type]);

  return (
    <Router>
      <Container />
      {/* {!auth.uid && <Header />} */}
      {routes.length > 0 && <Sidebar />}
      {!!auth.uid && !auth.primeiro_acesso && (
        <>
          <Chat />
          <HeaderUser />
        </>
      )}
      <BoxHelp />
      <SelectList />
      <PanelAction />
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/sucesso">
          <Success />
        </Route>
        <Route path="/notificacao">
          <Notification />
        </Route>
        <Route exact path="/cadastro/agente">
          <RegisterAgent />
        </Route>
        <Route exact path="/cadastro/cliente">
          <RegisterClient />
        </Route>
        <Route path="/login">
          {auth.uid && !auth.primeiro_acesso ? (
            <Redirect push from="/login" to="/inicio" />
          ) : (
            <Login />
          )}
        </Route>
        <Route path="/simulacao">
          <Simulation />
        </Route>
        {!!auth.uid && !auth.primeiro_acesso && auth.type === 'agent' && (
          <Route path="/relatorio">
            <Report />
          </Route>
        )}
        {routes
          .filter(route => route.key !== 'simulation')
          .map((route, index) => (
            <Route
              key={index}
              path={route.path}
              component={pages[route.component]}
            />
          ))}
        <Route>
          <Redirect to={auth.uid ? '/inicio' : '/'} />
        </Route>
      </Switch>
      <ToastContainer />
    </Router>
  );
}

export default App;

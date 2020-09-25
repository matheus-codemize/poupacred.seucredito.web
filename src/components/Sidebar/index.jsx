import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactSidebar from 'react-sidebar';
import { useDispatch } from 'react-redux';

// import { logout } from '../../redux/modules/auth/actions';

import Header from '../Header';
import SidebarNavLink from './SidebarNavLink';

import './styles.css';
function Sidebar({ routes }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState('50%');
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);

  const routesMemo = useMemo(() => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} exact={route.exact}>
        <route.main />
      </Route>
    ));
  }, [routes]);

  function handleResize() {
    if (window.matchMedia(`(min-width: 700px)`).matches) {
      setWidth('25%');
    } else setWidth('50%');
  }

  function toggleOpen() {
    setOpen(!open);
  }

  function handleLogout() {
    // dispatch(logout());
  }

  return (
    <BrowserRouter>
      <ReactSidebar
        sidebarClassName="sidebar"
        open={open}
        onSetOpen={toggleOpen}
        styles={{
          sidebar: {
            background: 'var(--color-background)',
            width: width,
            zIndex: 5,
          },
          overlay: {
            zIndex: 4,
          },
        }}
        sidebar={
          <>
            <div className="user">
              <div className="user-content">
                <span className="text">
                  Bem vindo,
                  <br /> Fulano
                </span>
                <a href="/" onClick={handleLogout}>
                  Sair
                </a>
              </div>
            </div>
            <ul>
              <SidebarNavLink
                to="/propostas"
                title="Propostas"
                onClick={toggleOpen}
              />
              <SidebarNavLink to="/crm" title="CRM" onClick={toggleOpen} />
            </ul>
          </>
        }
      >
        <Header showMenu={true} onClickMenu={toggleOpen} />
        <Switch>{routesMemo}</Switch>
      </ReactSidebar>
    </BrowserRouter>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.array.isRequired,
};
export default Sidebar;

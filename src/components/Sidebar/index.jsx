import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactSidebar from 'react-sidebar';

import Header from '../Header';
import SidebarNavLink from './SidebarNavLink';

import './styles.css';
function Sidebar({ routes }) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState('50%');
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);

  function handleResize() {
    console.log(window.matchMedia(`(min-width: 700px)`).matches);
    if (window.matchMedia(`(min-width: 700px)`).matches) {
      setWidth('25%');
    } else setWidth('50%');
  }

  function toggleOpen() {
    setOpen(!open);
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
              <span className="text">
                Bem vindo,
                <br /> Fulano
              </span>
            </div>
            <ul>
              <SidebarNavLink to="/crm" title="CRM" onClick={toggleOpen} />
            </ul>
          </>
        }
      >
        <Header showMenu={true} onClickMenu={toggleOpen} />
        <Switch>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact}>
              <route.main />
            </Route>
          ))}
        </Switch>
      </ReactSidebar>
    </BrowserRouter>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.array.isRequired,
};
export default Sidebar;

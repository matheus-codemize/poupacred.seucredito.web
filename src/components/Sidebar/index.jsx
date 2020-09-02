import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { BrowserRouter, Link, Switch, Route, NavLink } from 'react-router-dom';
import Header from '../Header';
import Button from '../Button';
function Sidebar({ routes }) {
  const [open, setOpen] = useState(false);
  function sidebarToggle() {
    // setOpen(!open);
    document.getElementById('sidebar').classList.toggle('sidebar-open');
    document.getElementById('sidebar').classList.toggle('sidebar-close');
    document.getElementById('main').classList.toggle('main-open');
  }
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <div id="sidebar" className="sidebar-close">
          <div className="user">
            <span className="text">
              Bem vindo,
              <br /> Fulano
            </span>
          </div>
          <ul>
            <li>
              <NavLink to="/login" activeClassName="active-menu">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/crm" activeClassName="active-menu">
                CRM
              </NavLink>
            </li>
            <li>
              <NavLink to="/shoelaces" activeClassName="active-menu">
                Shoelaces
              </NavLink>
            </li>
          </ul>
        </div>
        <div id="main">
          {/* <div className="click-zone"></div> */}
          <Header showMenu={true} onClickMenu={sidebarToggle} />
          <Switch>
            {routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
              <Route key={index} path={route.path} exact={route.exact}>
                <route.main />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.array.isRequired,
};
export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';

function SidebarNavLink({ onClick, title, to }) {
  function handleClick() {
    if (typeof onClick === 'function') {
      onClick();
    }
  }
  return (
    <li>
      <NavLink to={to} activeClassName="active-menu" onClick={handleClick}>
        {title}
      </NavLink>
    </li>
  );
}

export default SidebarNavLink;

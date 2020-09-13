import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function SidebarNavLink({ onClick, title, to, exact }) {
  function handleClick() {
    if (typeof onClick === 'function') {
      onClick();
    }
  }
  return (
    <li>
      <NavLink
        to={to}
        exact={exact}
        activeClassName="active-menu"
        onClick={handleClick}
      >
        {title}
      </NavLink>
    </li>
  );
}

SidebarNavLink.defaultProps = {
  exact: true,
};

SidebarNavLink.propTypes = {
  exact: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
export default SidebarNavLink;

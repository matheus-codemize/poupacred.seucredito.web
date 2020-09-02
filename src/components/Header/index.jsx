import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

// assets
import logo from '../../assets/images/logo.png';

// style
import './style.css';

// components
import Button from '../Button';

function Header({ showMenu, onClickMenu, ...rest }) {
  const [errorLoadLogo, setErrorLoadLogo] = useState(false);
  const history = useHistory();

  function setErrorLogo() {
    if (!errorLoadLogo) setErrorLoadLogo(true);
  }

  function handleLogin() {
    history.push('/login');
  }

  return (
    <header id="header-app">
      <div className="content">
        {showMenu && (
          <button className="menu-button" onClick={onClickMenu}>
            <i className="fa fa-bars" aria-hidden="true" />
          </button>
        )}
        <Link to="/">
          {!errorLoadLogo ? (
            <img
              src={logo}
              alt="logo"
              className="logo"
              onError={setErrorLogo}
            />
          ) : (
            <h2>TEM CRÉDITO</h2>
          )}
        </Link>
        <Button reverse icon="fa-sign-in-alt" onClick={handleLogin}>
          Entrar
        </Button>
      </div>
    </header>
  );
}

export default Header;

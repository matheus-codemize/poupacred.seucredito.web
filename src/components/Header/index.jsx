import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// assets
import logo from '../../assets/images/logo.png';

// style
import './style.css';

// components
import Button from '../Button';

function Header({ ...rest }) {
  const [errorLoadLogo, setErrorLoadLogo] = useState(false);
  const history = useHistory();

  function setErrorLogo() {
    if (!errorLoadLogo) setErrorLoadLogo(true);
  }

  function handleLogin() {
    history.push('/login');
  }

  return (
    <header {...rest} id="header-app">
      <div className="content">
        {!errorLoadLogo ? (
          <img src={logo} alt="logo" className="logo" onError={setErrorLogo} />
        ) : (
          <h2>TEM CRÉDITO</h2>
        )}
        <Button reverse icon="fa-sign-in-alt" onClick={handleLogin}>
          Entrar
        </Button>
      </div>
    </header>
  );
}

export default Header;

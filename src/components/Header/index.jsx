import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

// css
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// assets
import logo from '../../assets/images/logo.png';

// components
import Button from '../Button';

function Header() {
  const history = useHistory();
  const [opactity, setOpactity] = useState(0);
  const [loadLogo, setLoadLogo] = useState(true);

  useEffect(() => {
    window.removeEventListener('scroll', this);
    window.addEventListener('scroll', () => {
      const scroll = Math.min(100, window.scrollY);
      const value = scroll / 100;
      if (!value || opactity - value > 0.1 || opactity - value < -0.1) {
        setOpactity(value);
      }
    });
  }, [opactity]);

  function handleLogin() {
    history.push('/login');
  }

  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: `rgba(var(--color-background), ${opactity})`,
        boxShadow: opactity === 1 ? '0px 1px 3px 1px #ccc' : undefined,
      }}
    >
      <Link to="/">
        {loadLogo ? (
          <img
            src={logo}
            alt="logo"
            className={styles.logo}
            onError={() => setLoadLogo(false)}
          />
        ) : (
          <h2>{language['header.title']}</h2>
        )}
      </Link>
      <Button icon="fa-sign-in-alt" onClick={handleLogin}>
        {language['header.button.sigin.text']}
      </Button>
    </header>
  );
}

export default Header;

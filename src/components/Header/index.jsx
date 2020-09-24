import React, { useMemo, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

// redux
import { useSelector } from 'react-redux';

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
  const { token } = useSelector(state => state.auth);

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

  const renderButtonSignin = useMemo(() => {
    if (token || history.location.pathname.includes('login')) return <></>;

    return (
      <Button icon="fa fa-sign-in-alt" onClick={() => history.push('/login')}>
        {language['header.button.sigin.text']}
      </Button>
    );
  }, [token, history, history.location, history.location.pathname]);

  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: `rgba(var(--color-white), ${opactity})`,
        boxShadow:
          opactity === 1
            ? '0px 1px 3px 1px rgba(var(--color-black), 0.2)'
            : undefined,
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
          <h2>{language['title']}</h2>
        )}
      </Link>
      {renderButtonSignin}
    </header>
  );
}

export default Header;

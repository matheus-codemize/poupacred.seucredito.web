import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, Link } from 'react-router-dom';

// redux
import actionsSidebar from '../../redux/actions/sidebar';

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
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);

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

  function handleSidebar() {
    dispatch(actionsSidebar.open());
  }

  const renderLogo = useMemo(() => {
    if (location.pathname !== '/') {
      if (auth.uid) {
        return auth.primeiro_acesso ? (
          <></>
        ) : (
          <button
            onClick={handleSidebar}
            className={styles.btn_open_sidebar}
            style={{
              color:
                opactity >= 0.5
                  ? `rgba(var(--color-primary), ${opactity})`
                  : 'rgb(var(--color-white))',
              borderColor:
                opactity >= 0.5
                  ? `rgba(var(--color-primary), ${opactity})`
                  : 'rgb(var(--color-white))',
            }}
          >
            <i className="fa fa-bars" />
          </button>
        );
      }
    }

    return (
      <Link to={location.pathname.includes('success') ? '#' : '/'}>
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
    );
  }, [opactity, auth, auth.uid, loadLogo, location]);

  const renderButtonSignin = useMemo(() => {
    if (
      location.pathname.includes('login') ||
      location.pathname.includes('success') ||
      location.pathname.includes('register') ||
      (auth.uid && location.pathname !== '/')
    )
      return <></>;
    return (
      <Button icon="fa fa-sign-in-alt" onClick={() => history.push('/login')}>
        {language['header.button.sigin.text']}
      </Button>
    );
  }, [opactity, auth, auth.uid, location.pathname]);

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
      {renderLogo}
      {renderButtonSignin}
    </header>
  );
}

export default Header;

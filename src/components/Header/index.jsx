import React, { useRef, useMemo, useEffect, useState } from 'react';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// assets
import logo from '../../assets/images/logo.png';

// components
import Button from '../Button';

const languageComp = language['component.header'];

function Header() {
  // references
  const headerRef = useRef(null);

  // resources hooks
  const history = useHistory();

  // redux state
  const navigator = useSelector(state => state.navigator);

  // component state
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', scrollWindow);

    return () => {
      window.removeEventListener('scroll', scrollWindow);
    };
  }, [navigator.type]);

  function handleAgent(event) {
    event.stopPropagation();
    history.push('/cadastro/agente');
  }

  function handleLoginClient(event) {
    event.stopPropagation();
    history.push('/login', { login: { type: 'client' } });
  }

  function handleTop() {
    $('html, body').animate({ scrollTop: 0 });
  }

  function handleLogin() {
    history.push('/login');
  }

  function scrollWindow() {
    const { advantage_title, advantage, animation_visible } = styles;
    const classes = [advantage_title, advantage];

    setScroll(prevScroll => {
      if (headerRef.current) {
        if (!window.scrollY) {
          headerRef.current.style.top = 0;
          headerRef.current.style.position = 'absolute';
        } else {
          setTimeout(() => {
            headerRef.current.style.position = 'fixed';
          }, 400);

          if (prevScroll > window.scrollY) {
            headerRef.current.style.top = 0;
          } else {
            headerRef.current.style.top = `-${
              headerRef.current.offsetHeight + 5
            }px`;
          }
        }

        if (prevScroll > 80) {
          headerRef.current.classList.add(styles.header_block);
        } else {
          headerRef.current.classList.remove(styles.header_block);
        }
      }
      return window.scrollY;
    });
  }

  const renderActions = useMemo(() => {
    const dropdown = (
      <div className={styles.dropdown}>
        {navigator.window.size.x < 500 && (
          <Button onClick={handleLogin}>{languageComp.label.login}</Button>
        )}
        <Button onClick={handleLoginClient}>{languageComp.label.client}</Button>
        <Button type="secondary" onClick={handleAgent}>
          {languageComp.label.agent}
        </Button>
      </div>
    );

    return navigator.window.size.x < 500 ? (
      <i className="fas fa-caret-down">{dropdown}</i>
    ) : (
      <Button onClick={handleLogin} icon="fas fa-caret-down">
        {languageComp.label.login}
        {dropdown}
      </Button>
    );
  }, [navigator.window.size.x]);

  return (
    <header ref={headerRef} className={styles.header}>
      <img src={logo} onClick={handleTop} />
      {renderActions}
    </header>
  );
}

export default Header;

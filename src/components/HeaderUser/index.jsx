import React, { useState, useMemo } from 'react';
import styles from './style.module.css';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// redux
import actionsAuth from '../../redux/actions/auth';
import actionsSidebar from '../../redux/actions/sidebar';
import actionsContainer from '../../redux/actions/container';

// utils
import language from '../../utils/language';

const languageComp = language['component.header.user'];

function HeaderUser() {
  // resources hooks
  const history = useHistory();
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);
  const sidebar = useSelector(state => state.sidebar);

  // component state
  const [open, setOpen] = useState(false);

  function openSidebar(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    if (!open) {
      setOpen(false);
      dispatch(actionsSidebar.open());
      dispatch(
        actionsContainer.open({ color: 'white', onClose: closeSidebar }),
      );
    } else {
      handleUser();
    }
  }

  function closeSidebar() {
    dispatch(actionsSidebar.close());
  }

  function handleUser(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    setOpen(prevOpen => {
      dispatch(
        actionsContainer[prevOpen ? 'close' : 'open']({
          color: 'black',
          onClose: handleUser,
        }),
      );
      return !prevOpen;
    });
  }

  function handleLogout() {
    history.push('/');
    dispatch(actionsAuth.logout());
  }

  const renderIconUser = useMemo(() => {
    return (
      <div className={styles.actions}>
        <i className="fas fa-flag" />
        {auth.nome && typeof auth.nome === 'string' && (
          <span className={styles.dropdown_icon} onClick={handleUser}>
            {auth.nome.charAt(0)}
          </span>
        )}
      </div>
    );
  }, [auth.nome]);

  const renderDropdownUser = useMemo(() => {
    return (
      <div data-open={open} className={styles.dropdown}>
        <div className={styles.profile}>{auth.nome.charAt(0)}</div>
        <h1>{auth.nome}</h1>
        <div className={styles.dropdown_actions}>
          <Link to="/perfil">{languageComp.edit}</Link>
          <Link to="/" onClick={handleLogout}>
            {languageComp.logout}
          </Link>
        </div>
      </div>
    );
  }, [open, auth]);

  return (
    <div
      data-dropdown={open}
      data-sidebar={sidebar.open}
      className={styles.container}
      onClick={open ? handleUser : undefined}
    >
      <i
        onClick={openSidebar}
        className="fas fa-bars"
        style={{ opacity: open ? 0.5 : 1 }}
      />
      {renderIconUser}
      {renderDropdownUser}
    </div>
  );
}

export default HeaderUser;

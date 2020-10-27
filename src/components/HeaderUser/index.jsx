import React, { useState, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

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

  // component state
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  function openSidebar(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    if (!openProfile) {
      setOpenProfile(false);
      dispatch(actionsSidebar.open());
      dispatch(actionsContainer.sidebar({ onClose: closeSidebar }));
    } else {
      handleUser();
    }
  }

  function closeSidebar() {
    dispatch(actionsSidebar.close());
  }

  function handleNofication(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    setOpenProfile(false);
    setOpenNotification(prevOpenNotification => {
      dispatch(
        actionsContainer[prevOpenNotification ? 'close' : 'open']({
          color: 'black',
          onClose: handleUser,
        }),
      );
      return !prevOpenNotification;
    });
  }

  function handleUser(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    setOpenNotification(false);
    setOpenProfile(prevOpenProfile => {
      dispatch(
        actionsContainer[prevOpenProfile ? 'close' : 'open']({
          color: 'black',
          onClose: handleUser,
        }),
      );
      return !prevOpenProfile;
    });
  }

  function handleLogout() {
    history.push('/');
    dispatch(actionsAuth.logout());
  }

  const renderActions = useMemo(() => {
    return (
      <div className={styles.actions}>
        <i className="fas fa-flag" onClick={handleNofication} />
        {auth.nome && typeof auth.nome === 'string' && (
          <span className={styles.dropdown_profile_icon} onClick={handleUser}>
            {auth.nome.charAt(0)}
          </span>
        )}
      </div>
    );
  }, [openProfile, auth.nome]);

  const renderDropdownProfile = useMemo(() => {
    return (
      <div data-open={openProfile} className={styles.dropdown_profile}>
        <div className={styles.profile}>{auth.nome.charAt(0)}</div>
        <h1>{auth.nome}</h1>
        <div className={styles.dropdown_profile_actions}>
          <Link to="/perfil">{languageComp.edit}</Link>
          <Link to="/" onClick={handleLogout}>
            {languageComp.logout}
          </Link>
        </div>
      </div>
    );
  }, [auth, openProfile]);

  return (
    <div
      className={styles.container}
      data-dropdown={openProfile || openNotification}
      onClick={
        openProfile
          ? handleUser
          : openNotification
          ? handleNofication
          : undefined
      }
    >
      <i onClick={openSidebar} className="fas fa-bars" />
      {renderActions}
      {renderDropdownProfile}
    </div>
  );
}

export default HeaderUser;

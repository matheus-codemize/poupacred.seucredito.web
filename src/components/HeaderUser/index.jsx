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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icone: 'fas fa-user',
      titulo: 'A margem saiu!',
      texto: 'Já era hora, não é mesmo ?!?!',
      url: '...',
      data: '5 min',
      lido: false,
    },
    {
      id: 1,
      icone: 'fas fa-user',
      titulo: 'A margem saiu!',
      texto: 'Já era hora, não é mesmo ?!?!',
      url: '...',
      data: '5 min',
      lido: false,
    },
    {
      id: 1,
      icone: 'fas fa-user',
      titulo: 'A margem saiu!',
      texto: 'Já era hora, não é mesmo ?!?!',
      url: '...',
      data: '5 min',
      lido: false,
    },
    {
      id: 1,
      icone: 'fas fa-user',
      titulo: 'A margem saiu!',
      texto: 'Já era hora, não é mesmo ?!?!',
      url: '...',
      data: '5 min',
      lido: false,
    },
    {
      id: 1,
      icone: 'fas fa-user',
      titulo: 'A margem saiu!',
      texto: 'Já era hora, não é mesmo ?!?!',
      url: '...',
      data: '5 min',
      lido: false,
    },
    {
      id: 1,
      icone: 'fas fa-user',
      titulo: 'A margem saiu!',
      texto: 'Já era hora, não é mesmo ?!?!',
      url: '...',
      data: '5 min',
      lido: false,
    },
  ]);
  const [openNotification, setOpenNotification] = useState(false);

  function openSidebar(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    if (openProfile) return handleProfile();
    if (openNotification) return handleNofication();

    setOpenProfile(false);
    dispatch(actionsSidebar.open());
    dispatch(actionsContainer.sidebar({ onClose: closeSidebar }));
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
          onClose: handleNofication,
        }),
      );
      return !prevOpenNotification;
    });
  }

  function handleProfile(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    setOpenNotification(false);
    setOpenProfile(prevOpenProfile => {
      dispatch(
        actionsContainer[prevOpenProfile ? 'close' : 'open']({
          onClose: handleProfile,
        }),
      );
      return !prevOpenProfile;
    });
  }

  function handleLogout() {
    history.push('/');
    dispatch(actionsAuth.logout());
    dispatch(actionsContainer.close());
  }

  const renderDropdownProfile = useMemo(() => {
    return (
      <div
        data-type="profile"
        data-open={openProfile}
        className={styles.dropdown}
      >
        <div className={styles.dropdown_profile}>
          <div className={styles.profile}>{auth.nome.charAt(0)}</div>
          <h1>{auth.nome}</h1>
          <ul>
            <li>
              <Link to="/perfil">{languageComp.edit}</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>
                {languageComp.logout}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }, [auth, openProfile]);

  const renderDropdownNotification = useMemo(() => {
    return (
      <div
        data-type="notification"
        data-open={openNotification}
        className={styles.dropdown}
      >
        <div className={styles.dropdown_notification}>
          {notifications.length ? (
            <>
              <h1>
                {languageComp.notificationCount.replace(
                  '[length]',
                  notifications.length,
                )}
              </h1>
              <ul>
                {notifications.map((item, index) => (
                  <li key={index}>
                    <i className={item.icone} />
                    <div>
                      <h1>
                        {item.titulo}
                        <span>
                          <i className="fa fa-clock-o" /> {item.data}
                        </span>
                      </h1>
                      <p>{item.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/notificacoes">{languageComp.showAll}</Link>
            </>
          ) : (
            <div className={styles.dropdown_empty}>
              {languageComp.noticationEmpty}
            </div>
          )}
        </div>
      </div>
    );
  }, [notifications, openNotification]);

  const renderActions = useMemo(() => {
    return (
      <div className={styles.actions}>
        <i className="fas fa-flag" onClick={handleNofication} />
        {renderDropdownNotification}
        {auth.nome && typeof auth.nome === 'string' && (
          <span
            onClick={handleProfile}
            className={styles.dropdown_profile_icon}
          >
            {auth.nome.charAt(0)}
          </span>
        )}
        {renderDropdownProfile}
      </div>
    );
  }, [
    openProfile,
    auth.nome,
    renderDropdownProfile,
    renderDropdownNotification,
  ]);

  return (
    <div
      className={styles.container}
      data-dropdown={openProfile || openNotification}
      onClick={
        openProfile
          ? handleProfile
          : openNotification
          ? handleNofication
          : undefined
      }
    >
      <i onClick={openSidebar} className="fas fa-bars" />
      {renderActions}
    </div>
  );
}

export default HeaderUser;

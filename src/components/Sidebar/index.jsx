import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/sidebar';
import actionsAuth from '../../redux/actions/auth';

// utils
import language from '../../utils/language';

// resources
import { routesAgent, routesClient } from '../../resources/data/sidebar/routes';

const languageComponent = language['component.sidebar'];

function Sidebar() {
  const history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const sidebar = useSelector(state => state.sidebar);

  const [routes, setRoutes] = useState([]);
  const [className, setClassName] = useState('');

  useEffect(() => {
    let styleClass = styles.sidebar;

    if (sidebar.open) {
      styleClass += ` ${styles.siderbar_open}`;
    }

    setClassName(styleClass);
  }, [sidebar, sidebar.open]);

  useEffect(() => {
    switch (auth.type) {
      case 'client':
        setRoutes([...routesClient]);
        break;

      case 'agent':
        setRoutes([...routesAgent]);
        break;

      default:
        setRoutes([]);
        break;
    }
  }, [auth, auth.type]);

  function handleSidebar() {
    if (sidebar.open) {
      dispatch(actions.close());
    } else {
      dispatch(actions.open());
    }
  }

  function handleLogout() {
    history.push('/');
    dispatch(actions.close());
    dispatch(actionsAuth.logout());
  }

  const renderHeader = useMemo(() => {
    return <div className={styles.header}>{language['title']}</div>;
  }, [sidebar, sidebar.open]);

  return (
    <div className={className}>
      {renderHeader}
      <ul>
        {routes.map((route, index) => (
          <li key={index}>
            <Link to={route.path} onClick={handleSidebar}>
              <i className={route.icon} /> {route.name}
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        data-unique="true"
        onClick={handleLogout}
        className={styles.btn_logout}
      >
        <i className="fa fa-sign-out-alt" />
        {languageComponent.logout}
      </button>
    </div>
  );
}

export default Sidebar;

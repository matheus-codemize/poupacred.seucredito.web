import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/sidebar';
import actionsAuth from '../../redux/actions/auth';
import actionsContainer from '../../redux/actions/container';

// utils
import language from '../../utils/language'

// resources
import { routesAgent, routesClient } from '../../resources/data/sidebar/routes';

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

  function selectRoute() {
    dispatch(actions.close());
    dispatch(actionsContainer.close());
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
            <Link to={route.path} onClick={selectRoute}>
              <i className={route.icon} /> {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

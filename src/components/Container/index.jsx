import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actionsSidebar from '../../redux/actions/sidebar';

/**
 * Esse componente serve apenas para ocupar o espaço da tela,
 * afim de bloquear o uso dela qndo o menu estiver ativo
 */
function Container() {
  const dispatch = useDispatch();
  const sidebar = useSelector(state => state.sidebar);

  function closeSidebar() {
    dispatch(actionsSidebar.close());
  }

  return (
    <div
      onClick={closeSidebar}
      className={styles.container}
      style={{ display: sidebar.open ? 'block' : 'none' }}
    />
  );
}

export default Container;

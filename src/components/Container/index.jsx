import React, { useEffect, useState } from 'react';
import $ from 'jquery';
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
  const navigator = useSelector(state => state.navigator);

  const [block, setBlock] = useState(false);

  useEffect(() => {
    setBlock(sidebar.open || navigator.loading);
  }, [sidebar.open, navigator.loading]);

  useEffect(() => {
    const all = ['a', 'tab', 'button', 'input', 'select'];
    $('body').css('overflow', block ? 'hidden' : 'auto');
    all.forEach(type =>
      $(`body ${type}:not([data-unique])`).each(
        function () {
          $(this).attr('disabled', block);
          $(this).attr('tabIndex', block ? -1 : 0);
        },
      ),
    );
  }, [block]);

  function closeSidebar() {
    dispatch(actionsSidebar.close());
  }

  return (
    <div
      onClick={closeSidebar}
      className={styles.container}
      style={{ display: block ? 'block' : 'none' }}
    >
      {navigator.loading && <i className="fas fa-spinner fa-spin" />}
    </div>
  );
}

export default Container;

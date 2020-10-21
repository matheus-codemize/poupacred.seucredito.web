import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actionsBox from '../../redux/actions/box';
import actionsSidebar from '../../redux/actions/sidebar';

/**
 * Esse componente serve apenas para ocupar o espaço da tela,
 * afim de bloquear o uso dela qndo o menu estiver ativo ou a página estiver carregando algum recurso externo
 * além de quando o recurso "Help" é utilizado
 */
function Container() {
  const dispatch = useDispatch();
  const box = useSelector(state => state.box);
  const sidebar = useSelector(state => state.sidebar);
  const navigator = useSelector(state => state.navigator);

  const [block, setBlock] = useState(false);

  useEffect(() => {
    setBlock(box.open || sidebar.open || navigator.loading);
  }, [box.open, sidebar.open, navigator.loading]);

  useEffect(() => {
    const all = ['a', 'tab', 'button', 'input', 'select'];
    $('body').css('overflow', block ? 'hidden' : 'auto');
    all.forEach(type =>
      $(`body ${type}:not([data-unique])`).each(function () {
        $(this).attr('disabled', block);
        $(this).attr('tabIndex', block ? -1 : 0);
      }),
    );
  }, [block]);

  function closeContainer() {
    dispatch(actionsBox.close());
    dispatch(actionsSidebar.close());
  }

  return (
    <div
      onClick={closeContainer}
      className={styles.container}
      style={{ display: block ? 'block' : 'none' }}
    >
      {navigator.loading && <i className="fas fa-spinner fa-spin" />}
    </div>
  );
}

export default Container;

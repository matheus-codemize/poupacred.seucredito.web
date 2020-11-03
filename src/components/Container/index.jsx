import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/container';

/**
 * Esse componente serve apenas para ocupar o espaço da tela,
 * afim de bloquear o uso dela qndo o menu estiver ativo ou a página estiver carregando algum recurso externo
 * além de quando o recurso "Help" é utilizado ou o menu do usuário é aberto
 */
function Container() {
  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const container = useSelector(state => state.container);
  const { open, color, loading, onClose } = container;

  // component state
  const [elements, setElements] = useState([]);

  useEffect(() => {
    let el = [];
    const all = ['a', 'tab', 'button', 'input', 'select'];
    $('body').css('overflow', open ? 'hidden' : 'auto');

    if (open) {
      all.forEach(type => {
        $(`body ${type}:not([disabled]):not([data-unique])`).each(function () {
          el.push(this);
          disabledElements(this);
        });
      });
      setElements(el);
    } else {
      elements.map(disabledElements);
    }
  }, [open]);

  function disabledElements(element) {
    $(element).attr('disabled', open);
    $(element).attr('tabIndex', open ? -1 : 0);
  }

  function closeContainer() {
    dispatch(actions.close());

    if (typeof onClose === 'function') {
      onClose();
    }
  }

  return (
    <div
      onClick={closeContainer}
      className={styles.container}
      style={{
        display: open ? 'block' : 'none',
        backgroundColor: `rgba(var(--color-${color}), 0.5)`,
      }}
    >
      {loading && <i className="fas fa-spinner fa-spin" />}
    </div>
  );
}

export default Container;

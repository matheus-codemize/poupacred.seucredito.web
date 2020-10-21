import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// redux
import actions from '../../redux/actions/box';

function BoxHelp() {
  const dispatch = useDispatch();

  const box = useSelector(state => state.box);

  function handleClose() {
    dispatch(actions.close());
  }

  return (
    <div className={styles.container} data-open={box.open}>
      <h1>
        <i className={language['component.button.help'].icon} />
        {language['component.button.help'].text}
      </h1>
      <i
        className={language['component.button.close'].icon}
        onClick={handleClose}
      />
      {box.help}
    </div>
  );
}

export default BoxHelp;

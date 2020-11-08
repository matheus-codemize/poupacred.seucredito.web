import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// redux
import actionsRedux from '../../redux/actions/panel';
import actionsContainer from '../../redux/actions/container';

// components
import Box from '../Box';
import Button from '../Button';

function PanelAction() {
  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const navigator = useSelector(state => state.navigator);
  const panel = useSelector(state => state.panel);
  const { open, actions } = panel;

  useEffect(() => {
    // if (navigator.window.size.x >= 600) {
    //   onClose();
    // }
  }, [navigator.window.size]);

  useEffect(() => {
    if (open) {
      dispatch(actionsContainer.open({ onClose }));
    }
  }, [open]);

  function onClose() {
    dispatch(actionsRedux.close());
    dispatch(actionsContainer.close());
  }

  function handleClick(action) {
    onClose();
    if (typeof action.onClick === 'function') {
      action.onClick();
    }
  }

  return (
    <div data-open={open} className={styles.container}>
      {/* <Box size="sm"> */}
      <div className={styles.action}>
        {actions.map((action, index) => (
          <Button
            light
            data-unique
            key={index}
            {...action}
            onClick={() => handleClick(action)}
          />
        ))}
      </div>
      {/* </Box> */}
    </div>
  );
}

export default PanelAction;

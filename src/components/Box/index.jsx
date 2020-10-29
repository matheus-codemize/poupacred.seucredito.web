import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/box';

// utils
import language from '../../utils/language';

// components
import Button from '../Button';

function Box({ help, size, onBack, children, ...rest }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.help(
        typeof help === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: help }} />
        ) : (
          help
        ),
      ),
    );
  }, [help]);

  function handleHelp() {
    dispatch(actions.open());
  }

  const handleBack = useCallback(() => {
    if (onBack && typeof onBack === 'function') onBack();
  }, [onBack]);

  const renderHelp = useMemo(() => {
    return help && typeof help === 'string' ? (
      <div dangerouslySetInnerHTML={{ __html: help }} />
    ) : (
      help
    );
  }, [help]);

  return (
    <div data-size={size} className={styles.container}>
      {onBack && (
        <div className={styles.back}>
          <Button
            type="link"
            onClick={handleBack}
            icon="fa fa-angle-left"
            style={{ marginBottom: '2rem' }}
          >
            {language['component.button.back'].text}
          </Button>
        </div>
      )}
      {children}
      {help && (
        <div className={styles.help}>
          <span onClick={handleHelp}>
            <i className={language['component.button.help'].icon} />
            {language['component.button.help'].text}
          </span>
        </div>
      )}
    </div>
  );
}

Box.defaultProps = {
  help: '',
  size: 'lg',
  onBack: false,
  children: <></>,
};

Box.propTypes = {
  onBack: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  help: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Box;

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import Button from '../Button';

function Box({ onBack, children, ...rest }) {
  const handleBack = useCallback(() => {
    if (onBack && typeof onBack === 'function') onBack();
  }, [onBack]);

  const renderBack = useMemo(() => {
    return (
      onBack && (
        <Button
          type="link"
          onClick={handleBack}
          icon="fa fa-angle-left"
          style={{ top: '2rem', left: '2rem', position: 'absolute' }}
        >
          {language['component.box']['button.back.text']}
        </Button>
      )
    );
  }, [handleBack, onBack]);

  return (
    <div className={styles.container} data-back={onBack ? 'visible' : 'hidden'}>
      {renderBack}
      {children}
    </div>
  );
}

Box.defaultProps = {
  onBack: false,
  children: <></>,
};

Box.propTypes = {
  children: PropTypes.element,
  onBack: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export default Box;

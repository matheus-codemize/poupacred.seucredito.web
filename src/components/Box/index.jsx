import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import Button from '../Button';

function Box({ help, onBack, children, ...rest }) {
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
    <div className={styles.container}>
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
          <Button type="link" icon="fa fa-help">
            {language['component.button.help'].text}
          </Button>
        </div>
      )}
    </div>
  );
}

Box.defaultProps = {
  help: '',
  onBack: false,
  children: <></>,
};

Box.propTypes = {
  children: PropTypes.node,
  help: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onBack: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export default Box;

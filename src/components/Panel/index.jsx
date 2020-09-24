import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Panel({ title, children, ...rest }) {
  const renderTitle = useMemo(() => {
    return title && <h1 className={styles.title}>{title}</h1>;
  }, [title]);

  return (
    <div className={styles.container}>
      {renderTitle}
      {children}
    </div>
  );
}

Panel.defaultProps = {
  title: '',
  children: <></>,
};

Panel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
};

export default Panel;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Help({ text, type, ...rest }) {
  return (
    <span {...rest} data-type={type} className={styles.help}>
      {text}
    </span>
  );
}

Help.defaultProps = {
  type: 'default',
};

Help.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['default', 'info', 'error', 'warning', 'success']),
};

export default Help;

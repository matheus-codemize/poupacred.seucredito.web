import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Label({ text, display, required, ...rest }) {
  return (
    <label {...rest} data-display={display} className={styles.label}>
      {text}
      {required && ' *'}
    </label>
  );
}

Label.defaultProps = {
  required: false,
  display: 'vertical',
};

Label.propTypes = {
  required: PropTypes.bool,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default Label;

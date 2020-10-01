import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Label({ text, display, ...rest }) {
  return (
    <label {...rest} data-display={display} className={styles.label}>
      {text}
    </label>
  );
}

Label.defaultProps = {
  display: 'vertical',
};

Label.propTypes = {
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default Label;

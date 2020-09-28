import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Radio({ checked, label, onChange, ...rest }) {
  const icon = useMemo(() => {
    return <i className={checked ? 'fas fa-check-circle' : 'far fa-circle'} />;
  }, [checked]);

  function handleChange() {
    if (typeof onChange === 'function') {
      onChange(!checked);
    }
  }

  return (
    <div {...rest} className={styles.container} onClick={handleChange}>
      {icon}
      <label>{label}</label>
    </div>
  );
}

Radio.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default Radio;

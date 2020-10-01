import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Radio from '../Radio';

function RadioGroup({ id, col, value, label, options, onChange, ...rest }) {
  const renderOptions = useMemo(() => {
    return options.map((option, index) => (
      <Radio
        key={index}
        label={option.label}
        checked={option.value === value}
        onChange={checked => handleChange(option.value)}
      />
    ));
  }, [value, options]);

  function handleChange(valueSelected) {
    if (typeof onChange === 'function') {
      onChange({ target: { id, value: valueSelected } });
    }
  }

  return (
    <div
      className={styles.container}
      data-col={typeof col === 'function' ? col(id) : col}
    >
      <label>{label}</label>
      <div className={styles.content_options}>{renderOptions}</div>
    </div>
  );
}

RadioGroup.defaultProps = {
  col: 16,
};

RadioGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  col: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
  ),
};

export default RadioGroup;

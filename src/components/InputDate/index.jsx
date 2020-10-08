import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Help from '../Help';
import Label from '../Label';

// utils
import moment from '../../utils/moment';

function InputDate({
  id,
  help,
  label,
  value,
  onBlur,
  dateMin,
  dateMax,
  display,
  helpType,
  disabled,
  required,
  onChange,

  col, // to width
  ...rest
}) {
  const formatDefault = 'YYYY-MM-DD';

  function handleChange(event) {
    const { value } = event.target;
    if (typeof onChange === 'function') {
      onChange({
        target: { id, value: moment(value, formatDefault).toDate() },
      });
    }
  }

  function handleBlur(event) {
    const { value: valueSelected } = event.target;
    if (!valueSelected) {
      $(`#${id}`).val('');
    }

    if (typeof onBlur === 'function') {
      onBlur({ target: { id, value: valueSelected } });
    }
  }

  const renderLabel = useMemo(() => {
    return (
      label && (
        <Label
          htmlFor={id}
          text={label}
          display={display}
          required={required}
        />
      )
    );
  }, [id, label, display, required]);

  const renderHelp = useMemo(() => {
    return help && <Help text={help} type={helpType} />;
  }, [help, helpType]);

  const getValue = useMemo(() => {
    if (value && moment(value).isValid()) {
      return moment(value).format(formatDefault);
    }

    return '';
  }, [value]);

  const getDateMin = useMemo(() => {
    if (dateMin && moment(dateMin).isValid()) {
      return moment(dateMin).format(formatDefault);
    }

    return '';
  }, [dateMin]);

  const getDateMax = useMemo(() => {
    if (dateMax && moment(dateMax).isValid()) {
      return moment(dateMax).format(formatDefault);
    }

    return '';
  }, [dateMax]);

  return (
    <div
      className={styles.container}
      data-col={typeof col === 'function' ? col(id) : col}
    >
      {renderLabel}
      <input
        {...rest}
        id={id}
        type="date"
        value={getValue}
        min={getDateMin}
        max={getDateMax}
        required={required}
        disabled={disabled}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {renderHelp}
    </div>
  );
}

InputDate.defaultProps = {
  col: 16,
  help: '',
  label: '',
  value: null,
  onBlur: null,
  dateMin: null,
  dateMax: null,
  onChange: null,
  required: false,
  disabled: false,
  display: 'vertical',
};

InputDate.propTypes = {
  onBlur: PropTypes.func,
  help: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  helpType: PropTypes.string,
  id: PropTypes.string.isRequired,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  col: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dateMin: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dateMax: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default InputDate;

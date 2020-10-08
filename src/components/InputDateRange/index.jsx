import React, { useCallback, useMemo } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Help from '../Help';
import Label from '../Label';

// utils
import moment from '../../utils/moment';

function InputDateRange({
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
    const idSelected = event.target.id;
    let valueInit = $(`#${id}_init`).val();
    let valueFinish = $(`#${id}_finish`).val();

    if (
      valueInit &&
      valueFinish &&
      moment(valueInit, formatDefault).toDate() >
        moment(valueFinish, formatDefault).toDate()
    ) {
      if (idSelected.includes('_init')) {
        valueFinish = valueInit;
      } else {
        valueInit = valueFinish;
      }
    }

    if (typeof onChange === 'function') {
      onChange({
        target: {
          id,
          value: [
            valueInit && moment(valueInit, formatDefault).toDate(),
            valueFinish && moment(valueFinish, formatDefault).toDate(),
          ],
        },
      });
    }
  }

  function handleBlur(event) {
    const { id: idSelected, value: valueSelected } = event.target;
    if (!valueSelected) {
      $(`#${idSelected}`).val('');
    }

    if (typeof onBlur === 'function') {
      const valueInit = $(`#${id}_init`).val();
      const valueFinish = $(`#${id}_finish`).val();
      onBlur({ target: { id, value: [valueInit, valueFinish] } });
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

  const getValue = useCallback(
    index => {
      if (value && Array.isArray(value) && index < value.length) {
        if (moment(value[index]).isValid()) {
          return moment(value[index]).format(formatDefault);
        }
      }

      return '';
    },
    [value],
  );

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
      <div className={styles.content}>
        <input
          {...rest}
          type="date"
          min={getDateMin}
          max={getDateMax}
          id={`${id}_init`}
          required={required}
          disabled={disabled}
          value={getValue(0)}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <input
          {...rest}
          type="date"
          min={getDateMin}
          max={getDateMax}
          id={`${id}_finish`}
          required={required}
          disabled={disabled}
          value={getValue(1)}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      {renderHelp}
    </div>
  );
}

InputDateRange.defaultProps = {
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

InputDateRange.propTypes = {
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

export default InputDateRange;

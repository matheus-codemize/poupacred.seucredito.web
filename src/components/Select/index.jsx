import React, { useEffect, useMemo, useState } from 'react';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/select';

// utils
import language from '../../utils/language';

// components
import Help from '../../components/Help';
import Label from '../../components/Label';

const typesAcceptValue = ['number', 'string'];

function Select({
  id,
  col,
  help,
  async,
  label,
  value,
  onBlur,
  display,
  options,
  required,
  multiple,
  helpType,
  onChange,
  onFilter,
  placeholder,
  ...rest
}) {
  // resources hooks
  const dispatch = useDispatch();

  // component state
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(
      actions.update({
        id,
        open,
        value,
        options,
        multiple,
        onChange: selectOption,
        filter: async ? '' : filter,
      }),
    );
  }, [id, open, async, filter, value, options, multiple]);

  useEffect(() => {
    setFilter('');
    let optionSelected;

    if (multiple && Array.isArray(value) && value.length) {
      return setText(
        value
          .map(v => {
            optionSelected = options.find(
              option => option.value.toString() === v.toString(),
            );

            return optionSelected ? optionSelected.label : '';
          })
          .filter(v => !!v)
          .join('; ')
          .trim(),
      );
    }

    if (!multiple && typesAcceptValue.includes(typeof value)) {
      optionSelected = options.find(
        option => option.value.toString() === value.toString(),
      );
      return setText(optionSelected ? optionSelected.label : '');
    }

    setText('');
  }, [id, value, options, multiple]);

  function handleChange(event) {
    const { value } = event.target;
    setFilter(value);
  }

  function handleFocus() {
    setOpen(true);
  }

  function handleBlur() {
    setOpen(false);
    if (typeof onBlur === 'function') onBlur({ target: { id, value } });
  }

  function selectOption(valueSelected) {
    let valueR = valueSelected;

    if (multiple && valueSelected) {
      valueR = [...value];
      const index = valueR.indexOf(valueSelected);
      if (index === -1) {
        valueR.push(valueSelected);
      } else if (valueR.length) {
        valueR.splice(index, 1);
      }
    }

    if (typeof onChange === 'function') {
      onChange({ target: { id, value: valueR } });
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

  const renderBtnClear = useMemo(() => {
    return (
      (multiple
        ? Array.isArray(value) && value.length > 0
        : typesAcceptValue.includes(typeof value) && value) && (
        <i
          className="fa fa-close"
          onClick={() => selectOption()}
          data-label={label ? 'on' : 'off'}
        />
      )
    );
  }, [value, label, multiple]);

  return (
    <div
      className={styles.container}
      data-col={typeof col === 'function' ? col(id) : col}
    >
      {renderLabel}
      <input
        {...rest}
        id={id}
        type="text"
        autoComplete="off"
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        value={open ? filter : text}
        placeholder={(open && text) || placeholder}
      />
      {renderBtnClear}
      {renderHelp}
    </div>
  );
}

Select.defaultProps = {
  col: 16,
  help: '',
  label: '',
  value: '',
  async: false,
  onBlur: null,
  onFilter: null,
  required: false,
  multiple: false,
  display: 'vertical',
  helpType: 'default',
  placeholder: language['component.select.placeholder'],
};

Select.propTypes = {
  async: PropTypes.bool,
  onBlur: PropTypes.func,
  help: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  onFilter: PropTypes.func,
  helpType: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  col: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default Select;

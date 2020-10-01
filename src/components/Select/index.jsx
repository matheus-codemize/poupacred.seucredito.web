import React, { useEffect, useMemo, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import Help from '../../components/Help';
import Label from '../../components/Label';

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
  helpType,
  onChange,
  onFilter,
  placeholder,
  ...rest
}) {
  /** para controle da posição da lista */

  /** para filtro e busca de uma opção da lista */
  const [filter, setFilter] = useState('');

  /** para controle do input e da lista */
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFilter('');
    const optionSelected = options.find(
      option => option.value.toString() === value.toString(),
    );

    if (optionSelected) {
      setText(optionSelected.label);
    } else {
      setText('');
    }
  }, [id, value, options]);

  function handleChange(event) {
    setFilter(event.target.value);
  }

  function handleFocus() {
    setOpen(true);
  }

  function handleBlur() {
    setOpen(false);
    if (typeof onBlur === 'function') onBlur({ target: { id, value } });
  }

  function selectOption(valueSelected = '') {
    if (typeof onChange === 'function') {
      onChange({ target: { id, value: valueSelected } });
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
      value && (
        <i
          className="fa fa-close"
          onClick={() => selectOption('')}
          data-label={label ? 'on' : 'off'}
        />
      )
    );
  }, [value, label]);

  const renderOptions = useMemo(() => {
    let optionsMap = JSON.parse(JSON.stringify(options));

    if (async) {
    } else {
      optionsMap = optionsMap.filter(option =>
        option.label.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    return optionsMap.map((option, index) => (
      <li
        {...option.optionProps}
        key={index}
        onMouseDown={() => selectOption(option.value)}
        data-selected={option.value === value ? 'on' : 'off'}
      >
        {option.label}
      </li>
    ));
  }, [async, value, filter, options]);

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
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        value={open ? filter : text}
        placeholder={(open && text) || placeholder}
      />
      {renderBtnClear}
      <div
        data-label={label ? 'on' : 'off'}
        data-visible={open ? 'on' : 'off'}
        className={styles.content_dataset}
      >
        <ul>{renderOptions}</ul>
      </div>
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
  onFilter: PropTypes.func,
  helpType: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  col: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Select;

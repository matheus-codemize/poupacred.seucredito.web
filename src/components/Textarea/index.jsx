import React, { useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Help from '../Help';
import Label from '../Label';
import Button from '../Button';

// utils
import format from '../../utils/format';
import language from '../../utils/language';

const languageComp = language['component.input'];

function Input({
  id,
  type,
  help,
  label,
  value,
  resize,
  action,
  display,
  onChange,
  required,
  htmlType,
  disabled,
  helpType,

  col, // to width
  ...rest
}) {
  // references
  const inputRef = useRef(null);

  function handleChange(event) {
    const { value: valueSelected } = event.target;
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

  return (
    <div
      data-label={!!label}
      data-display={display}
      className={styles.container}
      data-col={typeof col === 'function' ? col(id) : col}
    >
      {renderLabel}
      <textarea
        {...rest}
        id={id}
        ref={inputRef}
        value={value}
        required={required}
        disabled={disabled}
        data-resize={resize}
        onChange={handleChange}
      />
      {renderHelp}
    </div>
  );
}

Input.defaultProps = {
  rows: 4,
  col: 16,
  help: '',
  label: '',
  action: null,
  type: 'text',
  resize: false,
  required: false,
  disabled: false,
  htmlType: 'text',
  display: 'vertical',
};

Input.propTypes = {
  resize: PropTypes.bool,
  action: PropTypes.bool,
  help: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helpType: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  htmlType: PropTypes.oneOf(['text', 'password', 'email']),
  col: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  type: PropTypes.oneOf([
    'text',
    'cep',
    'cpf',
    'phone',
    'money',
    'number',
    'birthday',
  ]),
};

export default Input;

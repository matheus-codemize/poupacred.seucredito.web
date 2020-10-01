import React, { useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Help from '../Help';
import Label from '../Label';

function Input({
  id,
  help,
  label,
  display,
  required,
  htmlType,
  disabled,
  helpType,

  col, // to width
  ...rest
}) {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  function handlePassword() {
    if (!disabled) {
      setShowPassword(prevShow => !prevShow);
      inputRef.current.focus();
    }
  }

  const renderLabel = useMemo(() => {
    return (
      label && (
        <Label
          htmlFor={id}
          display={display}
          text={label + (required ? ' *' : '')}
        />
      )
    );
  }, [id, label, display, required]);

  const renderHelp = useMemo(() => {
    return help && <Help text={help} type={helpType} />;
  }, [help, helpType]);

  const renderAddonPassword = useMemo(() => {
    return htmlType === 'password' ? (
      <i
        onClick={handlePassword}
        className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'}
      />
    ) : (
      <></>
    );
  }, [showPassword, htmlType]);

  return (
    <div
      data-display={display}
      className={styles.container}
      data-label={label ? 'on' : 'off'}
      data-col={typeof col === 'function' ? col(id) : col}
    >
      {renderLabel}
      <input
        {...rest}
        id={id}
        ref={inputRef}
        required={required}
        disabled={disabled}
        type={showPassword ? 'text' : htmlType}
      />
      {renderHelp}
      {renderAddonPassword}
    </div>
  );
}

Input.defaultProps = {
  col: 16,
  help: '',
  label: '',
  required: false,
  disabled: false,
  htmlType: 'text',
  display: 'vertical',
};

Input.propTypes = {
  help: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helpType: PropTypes.string,
  id: PropTypes.string.isRequired,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  htmlType: PropTypes.oneOf(['text', 'password', 'email']),
  col: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

export default Input;

import React, { useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Input({
  id,
  help,
  label,
  display,
  required,
  htmlType,
  disabled,
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
        <label htmlFor={id}>
          {label}
          {required ? ' *' : ''}
        </label>
      )
    );
  }, [id, label, required]);

  const renderHelp = useMemo(() => {
    return help && <span className={styles.help}>{help}</span>;
  }, [help]);

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
  id: PropTypes.string.isRequired,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  htmlType: PropTypes.oneOf(['text', 'password', 'email']),
};

export default Input;

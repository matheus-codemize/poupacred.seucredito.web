import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Button({ type, dark, light, children, icon, gradient, ...rest }) {
  const renderIcon = useMemo(() => {
    return icon && <i className={icon} />;
  }, [icon]);

  const classNameComponent = useMemo(() => {
    let c = styles.button;
    if (light) c += ` ${styles[type + '-light']}`;
    else if (dark) c += ` ${styles[type + '-dark']}`;
    else if (gradient) c += ` ${styles[type + '-gradient']}`;
    else c += ` ${styles[type]}`;
    return c;
  }, [type, dark, light, gradient]);

  return (
    <button {...rest} className={classNameComponent}>
      {renderIcon}
      {children}
    </button>
  );
}

Button.defaultProps = {
  icon: '',
  light: false,
  gradient: false,
  type: 'primary',
  children: <></>,
  htmlType: 'button',
};

Button.propTypes = {
  dark: PropTypes.bool,
  light: PropTypes.bool,
  icon: PropTypes.string,
  gradient: PropTypes.bool,
  children: PropTypes.element,
  htmlType: PropTypes.oneOf(['button', 'submit']),
  type: PropTypes.oneOf(['primary', 'secondary']),
};

export default Button;

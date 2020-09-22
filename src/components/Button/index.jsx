import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Button({ type, dark, light, children, icon, gradient, ...rest }) {
  const renderIcon = useMemo(() => {
    return icon && <i className={icon} />;
  }, [icon]);

  const style = useMemo(() => {
    return {
      background: gradient
        ? `var(--color-${type}-gradient)`
        : `rgb(var(--color-${type}${light ? '-light' : dark ? '-dark' : ''}))`,
    };
  }, [type, dark, light, gradient]);

  return (
    <button {...rest} className={styles.button} style={style}>
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

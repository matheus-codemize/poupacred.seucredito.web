import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// style
import './style.css';

function Button({ color, reverse, icon, iconPosition, children, ...rest }) {
  const renderIcon = useMemo(() => {
    return icon && <i className={`fa ${icon} btn-icon`} />;
  }, [icon]);
  return (
    <button
      {...rest}
      className={`${
        color === 'link' ? 'link' : `btn ${color} ${reverse ? 'reverse' : ''}`
      }`}
    >
      {iconPosition === 'left' && renderIcon}
      {children}
      {iconPosition === 'right' && renderIcon}
    </button>
  );
}

Button.defaultProps = {
  icon: '',
  reverse: false,
  type: 'button',
  color: 'primary',
  iconPosition: 'left',
};

Button.propTypes = {
  icon: PropTypes.string,
  reverse: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'link']),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.string,
};

export default Button;

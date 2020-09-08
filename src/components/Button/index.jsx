import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// style
import './style.css';

function Button({
  color,
  reverse,
  icon,
  iconPosition,
  children,
  sm,
  lg,
  ...rest
}) {
  const renderIcon = useMemo(() => {
    return icon && <i className={`fa ${icon} btn-icon`} />;
  }, [icon]);

  const smSize = sm === '' ? '' : `sm-${sm}`;
  const lgSize = lg === '' ? '' : `lg-${lg}`;
  const buttonClasses = `${
    color === 'link' ? 'link' : `btn ${color} ${reverse ? 'reverse' : ''}`
  } ${lgSize} ${smSize}`;

  return (
    <button {...rest} className={buttonClasses}>
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
  lg: '',
  sm: '',
};

Button.propTypes = {
  icon: PropTypes.string,
  reverse: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'link']),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.string,
  lg: PropTypes.string,
  sm: PropTypes.string,
};

export default Button;

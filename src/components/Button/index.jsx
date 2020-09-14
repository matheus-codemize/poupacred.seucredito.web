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
  loading,
  onClick,
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

  function handleOnClick() {
    if (!loading) {
      if (typeof onClick === 'function') {
        onClick();
      }
    }
  }
  return (
    <button {...rest} className={buttonClasses} onClick={handleOnClick}>
      {loading ? (
        <span>
          <i className="fa fa-spinner fa-spin" />
          &nbsp;Carregando...
        </span>
      ) : (
        <>
          {iconPosition === 'left' && <>{renderIcon}&nbsp;</>}
          {children}
          {iconPosition === 'right' && <>&nbsp;{renderIcon}</>}
        </>
      )}
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
  loading: false,
};

Button.propTypes = {
  icon: PropTypes.string,
  loading: PropTypes.bool,
  reverse: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'link']),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.string,
  lg: PropTypes.string,
  sm: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

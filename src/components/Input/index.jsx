import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';
function Input({ type, label, htmlType, help, sm, lg, ...rest }) {
  return (
    <div className={`form-group lg-${lg} sm-${sm}`}>
      <label>{label}</label>
      <input {...rest} type={htmlType} />
      {help && <small className={`help input-${type}`}>{help}</small>}
    </div>
  );
}
Input.defaultProps = {
  sm: '100',
  lg: '100',
};
Input.propTypes = {
  type: PropTypes.oneOf(['error', 'success']),
  label: PropTypes.string.isRequired,
  htmlType: PropTypes.oneOf(['text', 'date', 'password', 'number', 'email']),
  help: PropTypes.string,
  sm: PropTypes.string,
  lg: PropTypes.string,
};

export default Input;

import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';
function Input({ type, label, htmlType, help, ...rest }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input {...rest} type={htmlType} />
      {help && <small className={`help input-${type}`}>{help}</small>}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.oneOf(['error', 'success']),
  label: PropTypes.string.isRequired,
  htmlType: PropTypes.oneOf(['text', 'date', 'password', 'number']),
  help: PropTypes.string,
};

export default Input;

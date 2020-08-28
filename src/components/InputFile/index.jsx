import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './styles.css';
function InputFile({ label, placeholder, name }) {
  const [filePlaceholder, setFilePlaceholder] = useState(placeholder);

  function handleSelectFile(e) {
    try {
      setFilePlaceholder(e.target.files[0].name);
    } catch (err) {
      setFilePlaceholder(placeholder);
    }
  }
  return (
    <div className="form-group-input-file">
      <label>{label}</label>
      <div className="input-file-wrapper">
        <div className="input-div">
          <span className="placeholder">{filePlaceholder}</span>
        </div>
        <div className="button-label">
          <label htmlFor={name}>
            <i className="fa fa-upload" />
          </label>
        </div>
      </div>
      <input
        id={name}
        name={name}
        type="file"
        value=""
        onChange={handleSelectFile}
      />
    </div>
  );
}

InputFile.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default InputFile;

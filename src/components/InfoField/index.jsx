import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';
function InfoField({ title, info }) {
  return (
    <div className="info-field">
      <span className="title">{title}</span>
      <span className="info">{info}</span>
    </div>
  );
}

InfoField.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
};
export default InfoField;

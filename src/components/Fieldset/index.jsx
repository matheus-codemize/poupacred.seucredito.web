import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';
function Fieldset({ title, children }) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-title">{title}</legend>
      <div className="fields">{children}</div>
    </fieldset>
  );
}

Fieldset.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
export default Fieldset;

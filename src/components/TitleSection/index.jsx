import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';
function TitleSection({ title }) {
  return (
    <div id="title-section">
      <h1 className="title">{title}</h1>
    </div>
  );
}

TitleSection.propTypes = {
  title: PropTypes.string.isRequired,
};
export default TitleSection;

import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';
function TitleSection({ title, children, small }) {
  return (
    <div id="title-section" style={small ? { minHeight: '12rem' } : {}}>
      <h1 className="title">{title}</h1>
      {children && <div className="content">{children}</div>}
    </div>
  );
}

TitleSection.defaultProps = {
  small: false,
};

TitleSection.propTypes = {
  small: PropTypes.bool,
  children: PropTypes.element,
  title: PropTypes.string.isRequired,
};
export default TitleSection;

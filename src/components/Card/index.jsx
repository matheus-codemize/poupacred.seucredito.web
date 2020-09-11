import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';
function Card({ children }) {
  return <div className="card">{children}</div>;
}

Card.propTypes = {
  children: PropTypes.element,
};
export default Card;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Card({ header, footer, onClick, ...rest }) {
  function handleClick() {
    if (typeof onClick === 'function') onClick();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>{header}</div>
      <div className={styles.footer}>{footer}</div>
      <div className={styles.button} onClick={handleClick}>
        <i className="fas fa-chevron-right" />
      </div>
    </div>
  );
}

Card.propTypes = {
  header: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Card;

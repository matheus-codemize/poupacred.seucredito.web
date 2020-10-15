import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Card({ header, footer, disabled, onClick, ...rest }) {
  function handleClick() {
    if (!disabled && typeof onClick === 'function') onClick();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>{header}</div>
      <div className={styles.footer}>{footer}</div>
      <div
        onClick={handleClick}
        data-disabled={disabled}
        className={styles.button}
      >
        <i className="fas fa-chevron-right" />
      </div>
    </div>
  );
}

Card.defaultProps = {
  disabled: false,
};

Card.propTypes = {
  disabled: PropTypes.bool,
  header: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Card;

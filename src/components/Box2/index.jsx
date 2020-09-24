import React from 'react';
import PropTypes from 'prop-types';

// components
import Button from '../Button';

import './styles.css';
function Box({ children, backVisible, onBack, ...rest }) {
  function handleBack() {
    if (typeof onBack === 'function') {
      onBack();
    }
  }
  return (
    <div id="box" {...rest}>
      {backVisible && (
        <div className="box-header">
          <Button color="link" icon="fa-chevron-left" onClick={handleBack}>
            Voltar
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}

Box.defaultProps = {
  backVisible: false,
};

Box.propTypes = {
  children: PropTypes.element,
  backVisible: PropTypes.bool,
  onBack: PropTypes.func,
};

export default Box;

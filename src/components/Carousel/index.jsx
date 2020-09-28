import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Carousel({ step, children, ...rest }) {
  const [translate, setTranslate] = useState(0);

  useEffect(() => {
    setTranslate(step * 100);
  }, [step]);

  const renderChildren = useMemo(() => {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, { visible: index === step });
    });
  }, [children]);

  return (
    <div className={styles.container}>
      <div
        className={styles.carousel}
        style={{ transform: `translate(-${translate}%, 0)` }}
      >
        {renderChildren}
      </div>
    </div>
  );
}

Carousel.Step = ({ visible, ...props }) => {
  return (
    <div
      {...props}
      visible={visible}
      className={styles.step}
      data-visible={visible ? 'on' : 'off'}
    />
  );
};

Carousel.propTypes = {
  step: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired,
};

export default Carousel;

import React, { useMemo, useEffect, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import styles from './style.module.css';

function Carousel({ step, children, ...rest }) {
  const [translate, setTranslate] = useState(0);

  useEffect(() => {
    setTranslate(step * 100);
  }, [step]);

  const renderChildren = useMemo(() => {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        id: `tab${index}`,
        visible: index === step,
      });
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

function Step({ id, visible, ...props }) {
  useEffect(() => {
    const inputTypes = ['a', 'input', 'select', 'button'];
    inputTypes.forEach(inputType => {
      $(`#${id} ${inputType}`).each(function () {
        $(this).attr('data-unique', true);
        $(this).attr('tabindex', visible ? 0 : -1);
      });
    });
  }, [id, visible]);

  return (
    <div {...props} id={id} data-visible={visible} className={styles.step} />
  );
}

Carousel.Step = Step;

Carousel.propTypes = {
  step: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired,
};

export default Carousel;

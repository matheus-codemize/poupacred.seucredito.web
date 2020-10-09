import React, { useState, useMemo, useEffect, useCallback } from 'react';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

function SelectList() {
  const idSelector = '#container_select_list';
  const select = useSelector(state => state.select);
  const navigator = useSelector(state => state.navigator);

  const element = useMemo(() => {
    return select.open ? document.getElementById(select.id) : null;
  }, [select.id, select.open]);

  useEffect(() => {
    setPosition(element && element.getBoundingClientRect());
  }, [element]);

  useEffect(() => {
    setTimeout(() => {
      setPosition(element && element.getBoundingClientRect());
    }, 300);
  }, [navigator.window.size]);

  function setPosition(rect) {
    if (!rect) {
      return;
    }

    $(idSelector).css('left', rect.left);
    $(idSelector).css('width', rect.width);
    $(idSelector).css(
      'top',
      `calc(${rect.bottom + window.scrollY}px + 0.5rem)`,
    );
    $(idSelector).css(
      'max-height',
      `calc(${navigator.window.size.y - rect.bottom}px - 1rem)`,
    );
  }

  const handleChange = useCallback(
    value => {
      if (typeof select.onChange === 'function') {
        select.onChange(value);
      }
    },
    [select.onChange],
  );

  const renderOptions = useMemo(() => {
    let render = [];
    const { value, filter } = select;

    if (select.options) {
      render = select.options
        .filter(option =>
          option.label.toLowerCase().includes(filter.toLowerCase()),
        )
        .map((option, index) => (
          <li
            {...option.optionProps}
            key={index}
            onMouseDown={() => handleChange(option.value)}
            data-selected={option.value === value ? 'on' : 'off'}
          >
            {option.label}
          </li>
        ));
    }

    return render.length ? (
      render
    ) : (
      <div className={styles.empty}>{language['component.select.empty']}</div>
    );
  }, [select]);

  return (
    <div
      data-open={select.open}
      className={styles.container}
      id={idSelector.replace('#', '')}
    >
      <ul>{renderOptions}</ul>
    </div>
  );
}

export default SelectList;

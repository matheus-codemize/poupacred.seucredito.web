import React, { useState, useMemo, useEffect, useCallback } from 'react';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

function SelectList() {
  const select = useSelector(state => state.select);
  const navigator = useSelector(state => state.navigator);

  /** state para controle da posição da listagem */
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);

  const element = useMemo(() => {
    return document.getElementById(select.id);
  }, [select, select.id]);

  useEffect(() => {
    if (element) {
      setPosition(element.getBoundingClientRect());
    }
  }, [select, select.id]);

  useEffect(() => {
    if (element) {
      setTimeout(() => {
        setPosition(element.getBoundingClientRect());
      }, 300);
    }
  }, [navigator.window.size]);

  useEffect(() => {
    $('#container_select_list').css('left', left);
    $('#container_select_list').css('width', width);
    $('#container_select_list').css('top', `calc(${bottom}px + 0.5rem)`);
    $('#container_select_list').css('max-height', `calc(${maxWidth}px - 1rem)`);
  }, [left, width, bottom, maxWidth]);

  function setPosition(rect) {
    setLeft(rect.left);
    setWidth(rect.width);
    setBottom(rect.bottom + window.scrollY);
    setMaxWidth(navigator.window.size.y - rect.bottom);
  }

  const handleChange = useCallback(
    value => {
      if (typeof select.onChange === 'function') {
        select.onChange(value);
      }
    },
    [select, select.onChange],
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
  }, [select, select.value, select.filter, select.options]);

  return (
    <div
      data-open={select.open}
      id="container_select_list"
      className={styles.container}
    >
      <ul>{renderOptions}</ul>
    </div>
  );
}

export default SelectList;

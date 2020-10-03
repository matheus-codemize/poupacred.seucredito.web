import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import Button from '../Button';

function PanelSearch({ children, ...rest }) {
  const render = useMemo(() => {
    return (
      <div className={styles.content_filter}>
        {React.Children.map(children, (child, index) =>
          index <= 1 ? React.cloneElement(child, { key: index }) : <></>,
        )}
      </div>
    );
  }, [children]);

  return <div>{render}</div>;
}

function Panel({ title, useFilter, children, ...rest }) {
  const navigator = useSelector(state => state.navigator);

  const [open, setOpen] = useState(false);
  const [searchLength, setSearchLength] = useState(0);
  const [childrenLength, setChildrenLength] = useState(0);

  function handleOpen() {
    setOpen(prevOpen => !prevOpen);
  }

  const renderTitle = useMemo(() => {
    return (
      title && (
        <h1>
          {typeof title === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: title }} />
          ) : (
            title
          )}
        </h1>
      )
    );
  }, [title]);

  const renderSearch = useMemo(() => {
    let components = [];
    let searchChildLength = 0;

    React.Children.forEach(children, child => {
      if (child.type.name === 'PanelSearch') {
        React.Children.forEach(child.props.children, (searchChild, index) => {
          searchChildLength++;
          if (open) {
            return components.push(searchChild);
          }

          if (navigator.window.size.x < 800) {
            if (index <= 1) components.push(searchChild);
          }

          if (
            navigator.window.size.x >= 800 &&
            navigator.window.size.x < 1000
          ) {
            if (index <= 2) components.push(searchChild);
          }

          if (navigator.window.size.x >= 1000) {
            if (index <= 3) components.push(searchChild);
          }
        });
      }
    });

    setSearchLength(components.length);
    setChildrenLength(searchChildLength);

    return (
      <div>
        {components.map((component, index) =>
          React.cloneElement(component, { key: index }),
        )}
      </div>
    );
  }, [open, children, navigator.window.size.x]);

  const renderContent = useMemo(() => {}, [children]);

  return (
    <div {...rest} className={styles.container}>
      <section
        data-open={open}
        data-size={searchLength}
        data-filter={open || childrenLength > searchLength}
        className={styles.section_header}
      >
        {renderTitle}
        {renderSearch}
        <i
          onClick={handleOpen}
          className={`fas fa-chevron-circle-${open ? 'up' : 'down'}`}
        />
      </section>
      <section
        data-size={searchLength}
        data-filter={childrenLength > searchLength}
        className={styles.section_body}
      >
        {renderContent}
      </section>
    </div>
  );
}

Panel.Search = PanelSearch;

Panel.defaultProps = {
  title: '',
  children: null,
  useFilter: false,
};

Panel.propTypes = {
  useFilter: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Panel;

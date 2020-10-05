import React, { useEffect, useMemo, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import Button from '../Button';

function PanelSearch({ ...rest }) {
  return <div {...rest} />;
}

function PanelBody({ ...rest }) {
  return <div {...rest} />;
}

function Panel({ title, onSearch, children, ...rest }) {
  const navigator = useSelector(state => state.navigator);

  const [open, setOpen] = useState(false);
  const [searchLength, setSearchLength] = useState(0);
  const [childrenLength, setChildrenLength] = useState(0);

  function handleOpen() {
    setOpen(prevOpen => !prevOpen);
  }

  function handleSearch() {
    setOpen(false);
    if (typeof onSearch === 'function') onSearch();
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
      <>
        <div className={styles.container_filter}>
          {components.map((component, index) =>
            React.cloneElement(component, { key: index }),
          )}
        </div>
        {open && (
          <Button icon="fas fa-search" onClick={handleSearch}>
            {language['component.button.search.text']}
          </Button>
        )}
      </>
    );
  }, [open, children, navigator.window.size.x]);

  const renderContent = useMemo(() => {
    let component = <></>;
    React.Children.forEach(children, child => {
      if (child.type.name === 'PanelBody') {
        component = child;
      }
    });

    return component;
  }, [children]);

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
        <div className={styles.container_action}>
          {!open && childrenLength > 0 && (
            <i onClick={handleSearch} className="fas fa-search" />
          )}
          {(open || childrenLength > searchLength) && (
            <i
              onClick={handleOpen}
              className={`fas fa-chevron-circle-${open ? 'up' : 'down'}`}
            />
          )}
        </div>
      </section>
      <section
        id="section_body"
        data-open={open}
        data-size={searchLength}
        data-filter={open || childrenLength > searchLength}
        className={styles.section_body}
      >
        {renderContent}
      </section>
    </div>
  );
}

Panel.Search = PanelSearch;

Panel.Body = PanelBody;

Panel.defaultProps = {
  title: '',
  children: null,
  onSearch: null,
};

Panel.propTypes = {
  onSearch: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Panel;

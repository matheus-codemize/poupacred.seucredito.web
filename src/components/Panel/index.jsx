import React, { useEffect, useMemo, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// redux
import actionsContainer from '../../redux/actions/container';

const languageComp = language['component.panel'];

function PanelSearch({ ...rest }) {
  return <div {...rest} />;
}

function PanelBody({ ...rest }) {
  return <div {...rest} />;
}

function Panel({
  title,
  actions,
  subtitle,
  children,
  onSearch,
  background,
  ...rest
}) {
  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const navigator = useSelector(state => state.navigator);

  // component state
  const [openSearch, setOpenSearch] = useState(false);
  const [searchSizeShow, setSearchSizeShow] = useState(0);
  const [searchSizeTotal, setSearchSizeTotal] = useState(0);

  useEffect(() => {
    window.onload = setHeightBody;
  }, []);

  useEffect(() => {
    setHeightBody();
  }, [openSearch, navigator.window.size]);

  function setHeightBody() {
    if (!openSearch) {
      setTimeout(() => {
        const elementHeader = $(`.${styles.header}`);
        $(`.${styles.body}`).css('top', elementHeader.innerHeight());
      }, 400);
    }
  }

  function handleActions() {
    dispatch(actionsContainer.open({ color: 'black' }));
  }

  const renderTitle = useMemo(() => {
    return (
      title &&
      (typeof title === 'string' ? (
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      ) : (
        React.cloneElement(title, { className: styles.title })
      ))
    );
  }, [title]);

  const renderSubtitle = useMemo(() => {
    return (
      subtitle &&
      (typeof subtitle === 'string' ? (
        <div
          className={styles.subtitle}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      ) : (
        React.cloneElement(subtitle, { className: styles.subtitle })
      ))
    );
  }, [subtitle]);

  const renderSearchOptions = useMemo(() => {
    let searchChildren = [];
    const element = React.Children.toArray(children).find(
      child => child.type === PanelSearch,
    );

    if (element) {
      searchChildren = React.Children.toArray(element.props.children);
      setSearchSizeTotal(searchChildren.length);

      if (!openSearch) {
        searchChildren = searchChildren.filter(
          (_child, index) =>
            (navigator.window.size.x < 800 && index <= 1) ||
            (navigator.window.size.x >= 800 &&
              navigator.window.size.x < 1000 &&
              index <= 2) ||
            (navigator.window.size.x >= 1000 && index <= 3),
        );
      }
      setSearchSizeShow(searchChildren.length);

      return <div className={styles.search}>{searchChildren}</div>;
    }

    return <></>;
  }, [children, openSearch, navigator.window.size]);

  const renderActionsHeader = useMemo(() => {
    const actionsHeader = [...actions];

    if (typeof onSearch === 'function') {
      actionsHeader.push({
        ...language['component.button.search'],
        onClick: onSearch,
      });
    }

    if (searchSizeTotal) {
      if (openSearch || searchSizeShow !== searchSizeTotal) {
        actionsHeader.push({
          text: languageComp[openSearch ? 'minus' : 'more'],
          icon: `fas fa-chevron-circle-${openSearch ? 'up' : 'down'}`,
          onClick: () => setOpenSearch(prevOpenSearch => !prevOpenSearch),
        });
      }
    }

    if (navigator.window.size.x < 600 && actionsHeader.length > 2) {
      return (
        <div className={styles.actions}>
          <button onClick={handleActions}>
            <i className={language['component.button.action'].icon} />
            {language['component.button.action'].text}
          </button>
        </div>
      );
    }

    return (
      actionsHeader.length > 0 && (
        <div className={styles.actions}>
          {actionsHeader.map(({ icon, text, onClick }, index) => (
            <button
              key={index}
              onClick={typeof onClick === 'function' ? onClick : undefined}
            >
              {icon && <i className={icon} />}
              {text || ''}
            </button>
          ))}
        </div>
      )
    );
  }, [
    actions,
    onSearch,
    openSearch,
    searchSizeShow,
    searchSizeTotal,
    navigator.window.size,
  ]);

  const renderBody = useMemo(() => {
    const element = React.Children.toArray(children).find(
      child => child.type === PanelBody,
    );
    return element || <></>;
  }, [children]);

  return (
    <div
      data-open={openSearch}
      className={styles.container}
      data-action={actions.length > 0 || searchSizeTotal > 0}
    >
      <section
        className={styles.header}
        style={{
          [background ? 'backgroundImage' : 'background']: background
            ? `linear-gradient(to bottom, rgba(var(--color-primary), 0.5), rgb(var(--color-primary)) 70%) , url(${background})`
            : 'rgb(var(--color-primary))',
        }}
      >
        {renderTitle}
        {renderSubtitle}
        {renderSearchOptions}
        {renderActionsHeader}
      </section>
      <section className={styles.body}>{renderBody}</section>
    </div>
  );
}

Panel.Body = PanelBody;
Panel.Search = PanelSearch;

Panel.defaultProps = {
  actions: [],
  subtitle: '',
  background: '',
  onSearch: null,
};

Panel.propTypes = {
  onSearch: PropTypes.func,
  background: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Panel;

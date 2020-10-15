import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

const languageComponent = language['component.pagination'];

function Pagination({ show, current, size, total, onChange, ...rest }) {
  const [currentPage, setCurrentPage] = useState(current);

  useEffect(() => {
    setCurrentPage(current);
  }, [current]);

  function handleChange(event) {
    let { value } = event.target;
    if (
      value &&
      (!isFinite(value) || isNaN(parseInt(value)) || parseInt(value) > total)
    ) {
      value = currentPage;
    }
    setCurrentPage(value && parseInt(value));
  }

  function handlePagination(page) {
    if (typeof onChange === 'function') {
      onChange(page);
    }
  }

  function blurCurrentPagination() {
    handlePagination(currentPage || current);
    if (!currentPage) setCurrentPage(current);
  }

  return (
    total > 1 && (
      <div className={styles.container}>
        <p>
          {languageComponent.legend
            .replace('[current]', current)
            .replace('[total]', total)}
        </p>
        <div className={styles.page}>
          {current === total && current - 2 > 0 && (
            <div onClick={() => handlePagination(current - 2)}>
              {current - 2}
            </div>
          )}
          {current - 1 > 0 && (
            <div onClick={() => handlePagination(current - 1)}>
              {current - 1}
            </div>
          )}
          <input
            value={currentPage}
            onChange={handleChange}
            onBlur={blurCurrentPagination}
            onKeyPress={event =>
              event.key === 'Enter' && blurCurrentPagination()
            }
          />
          {current + 1 <= total && (
            <div onClick={() => handlePagination(current + 1)}>
              {current + 1}
            </div>
          )}
          {current === 1 && current + 2 <= total && (
            <div onClick={() => handlePagination(current + 2)}>
              {current + 2}
            </div>
          )}
        </div>
      </div>
    )
  );
}

Pagination.defaultProps = {
  size: 20,
};

Pagination.propTypes = {
  size: PropTypes.number,
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
};

export default Pagination;

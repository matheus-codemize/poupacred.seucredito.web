import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import BoxData from '../BoxData';

function BoxDataList({ data, dataFooter, pagination, onPagination, ...rest }) {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(pagination.current);
  }, [pagination.current]);

  function handlePagination(current) {
    if (typeof onPagination === 'function') {
      onPagination({ ...pagination, current });
    }
  }

  function handleCurrentPagination(event) {
    let { value } = event.target;
    if (
      value &&
      (!isFinite(value) ||
        isNaN(parseInt(value)) ||
        parseInt(value) > pagination.total)
    ) {
      value = currentPage;
    }
    setCurrentPage(value && parseInt(value));
  }

  function blurCurrentPagination() {
    handlePagination(currentPage || pagination.current);
    if (!currentPage) setCurrentPage(pagination.current);
  }

  const renderPagination = useMemo(() => {
    const { current, total } = pagination;

    if (!data.length || total - 1 <= 0) return <></>;

    return (
      <div className={styles.pagination}>
        <p>
          {language['component.boxdatalist.pagination'].legend
            .replace('[current]', current)
            .replace('[total]', total)}
        </p>
        <div className={styles.pagination_page}>
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
            onBlur={blurCurrentPagination}
            onChange={handleCurrentPagination}
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
    );
  }, [
    data,
    currentPage,
    pagination.size,
    pagination.total,
    pagination.current,
  ]);

  return (
    <div className={styles.container}>
      <div data-size={data.length} className={styles.content}>
        {data.map((item, index) => (
          <BoxData
            {...item}
            key={index}
            footer={
              typeof dataFooter === 'function' ? dataFooter(item) : dataFooter
            }
          />
        ))}
        {data.length === 0 && (
          <h1>{language['component.boxdatalist.empty']}</h1>
        )}
      </div>
      {renderPagination}
    </div>
  );
}

BoxDataList.defaultProps = {
  dataFooter: null,
  onPagination: null,
};

BoxDataList.propTypes = {
  onPagination: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataFooter: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pagination: PropTypes.shape({
    size: PropTypes.number,
    total: PropTypes.number,
    current: PropTypes.number,
  }).isRequired,
};

export default BoxDataList;

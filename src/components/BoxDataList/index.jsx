import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import BoxData from '../BoxData';

function BoxDataList({
  data,
  footer,
  dataFooter,
  pagination,
  onPagination,
  ...rest
}) {
  function handlePagination(current) {
    if (typeof onPagination === 'function') {
      onPagination({ ...pagination, current });
    }
  }

  const renderFooter = useMemo(() => {
    if (footer) {
      return <div className={styles.footer}>{footer}</div>;
    }
    return <></>;
  }, [footer]);

  const renderPagination = useMemo(() => {
    return <></>;
  }, [pagination, pagination.size, pagination.total, pagination.current]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {data.map((item, index) => (
          <BoxData {...item} key={index} footer={dataFooter} />
        ))}
      </div>
      {renderPagination}
      {renderFooter}
    </div>
  );
}

BoxDataList.defaultProps = {
  footer: null,
  dataFooter: null,
  onPagination: null,
  pagination: { size: 20, total: 0, current: 1 },
};

BoxDataList.propTypes = {
  footer: PropTypes.node,
  dataFooter: PropTypes.node,
  pagination: PropTypes.shape({
    size: PropTypes.number,
    total: PropTypes.number,
    current: PropTypes.number,
  }),
  onPagination: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BoxDataList;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import BoxData from '../BoxData';
import Pagination from '../Pagination';

function BoxDataList({ data, pagination, onPagination, ...rest }) {
  function handlePagination(current) {
    if (typeof onPagination === 'function') {
      onPagination({ ...pagination, current });
    }
  }

  return (
    <div className={styles.container}>
      <div data-size={data.length} className={styles.content}>
        {data.map((item, index) => (
          <BoxData {...item} key={index} />
        ))}
        {data.length === 0 && (
          <h1>{language['component.boxdatalist.empty']}</h1>
        )}
      </div>
      <Pagination {...pagination} onChange={handlePagination} />
    </div>
  );
}

BoxDataList.defaultProps = {
  onPagination: null,
};

BoxDataList.propTypes = {
  onPagination: PropTypes.func,
  pagination: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BoxDataList;

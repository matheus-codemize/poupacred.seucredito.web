import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import BoxData from '../BoxData';
import ListEmpty from '../ListEmpty';
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
        <ListEmpty visible={data.length === 0} />
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

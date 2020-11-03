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

  function convertKeys(item) {
    if (item && typeof item === 'object') {
      let { details = [] } = item;

      if (!item.title && Object.prototype.hasOwnProperty.call(item, 'nome')) {
        item.title = item.nome;
      }

      if (Array.isArray(item.blocos)) {
        details = details.concat(
          item.blocos.map(bloco => ({
            title: bloco.nome,
            value: bloco.valor || '-',
            ...bloco,
          })),
        );
      }

      return { ...item, details };
    }

    return null;
  }

  return (
    <div className={styles.container}>
      <div data-size={data.length} className={styles.content}>
        {data.map((item, index) => (
          <BoxData {...convertKeys(item)} key={index} />
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

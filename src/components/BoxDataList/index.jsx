import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import BoxData from '../BoxData';
import ListEmpty from '../ListEmpty';
import Pagination from '../Pagination';

export function convertKeys(item) {
  if (item && typeof item === 'object') {
    if (!item.title && item.nome) {
      item.title = item.nome;
    }

    if (!item.details && Array.isArray(item.blocos)) {
      item.details = item.blocos.map(bloco => ({
        title: bloco.nome,
        value: bloco.valor || '-',
        width: bloco.tamanho || 100,
        ...bloco,
      }));
    }

    return item;
  }

  return null;
}

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
  pagination: { total: 1, current: 1 },
};

BoxDataList.propTypes = {
  onPagination: PropTypes.func,
  pagination: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BoxDataList;

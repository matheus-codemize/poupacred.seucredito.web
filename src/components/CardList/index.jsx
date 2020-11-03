import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Card from '../Card';
import ListEmpty from '../ListEmpty';
import Pagination from '../Pagination';

function CardList({ data, pagination, onPagination, ...rest }) {
  function handlePagination(current) {
    if (typeof onPagination === 'function') {
      onPagination({ ...pagination, current });
    }
  }

  function convertKeys(item) {
    const renderBloco = bloco => {
      return (
        <div className={styles.bloco}>
          {bloco.map((bloco, index) => (
            <div
              key={index}
              data-label={!!bloco.nome}
              data-width={bloco.tamanho || 100}
            >
              {bloco.imagem && <img src={bloco.valor} />}
              {bloco.nome && (
                <label className={styles.bloco_label}>
                  {bloco.nome}
                  {bloco.valor && ':'}
                </label>
              )}
              {bloco.valor && (
                <label className={styles.bloco_description}>
                  {bloco.valor}
                </label>
              )}
              {bloco.texto && <label>{bloco.texto}</label>}
            </div>
          ))}
        </div>
      );
    };

    if (item && typeof item === 'object') {
      // renderização do header do item
      if (!item.header && Array.isArray(item.cabecalho)) {
        item.header = renderBloco(item.cabecalho);
        delete item.cabecalho;
      }

      // renderização do footer do item
      if (!item.footer && Array.isArray(item.rodape)) {
        item.footer = renderBloco(item.rodape);
        delete item.rodape;
      }

      return item;
    }

    return null;
  }

  return (
    <div className={styles.container}>
      <div data-size={data.length} className={styles.content}>
        {data.map((item, index) => (
          <Card {...convertKeys(item)} key={index} />
        ))}
        <ListEmpty visible={data.length === 0} />
      </div>
      {pagination && <Pagination {...pagination} onChange={handlePagination} />}
    </div>
  );
}

CardList.defaultProps = {
  onPagination: null,
};

CardList.propTypes = {
  onPagination: PropTypes.func,
  pagination: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CardList;

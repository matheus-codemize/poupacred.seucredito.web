import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import ListEmpty from '../ListEmpty';

function Timeline({ data, ...rest }) {
  return (
    <div {...rest} className={styles.container}>
      <ListEmpty visible={!data.length} />
      {data.map((item, index) => (
        <div key={index}>
          <i className={item.icon || 'fas fa-user-clock'} />
          <div className={styles.item}>
            <h1>{item.title}</h1>
            {item.description && <label>{item.description}</label>}
            <span>
              <i className="fas fa-clock" />
              {item.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

Timeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
      title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
      description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    }),
  ).isRequired,
};

export default Timeline;

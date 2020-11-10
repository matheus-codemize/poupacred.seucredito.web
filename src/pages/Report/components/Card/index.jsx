import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Box from '../../../../components/Box';

function CardReport({
  title,
  percent,
  subtitle,
  netValue,
  grossValue,
  ...rest
}) {
  // references
  const percentRef = useRef(null);

  useEffect(() => {
    if (percent && percent < 100 && percentRef.current) {
      percentRef.current.style.width = `${percent}%`;
    }
  }, [percent, percentRef.current]);

  return (
    <Box>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{title}</h1>
          <p>
            {subtitle.name}: <span>{subtitle.value}</span>
          </p>
        </div>
        <div className={styles.value}>
          <p>{netValue.name}</p>
          <span>{netValue.value}</span>
        </div>
        <div className={styles.percent} data-value={percent}>
          <h1>{percent} %</h1>
          <div ref={percentRef} />
        </div>
        <div className={styles.value}>
          <p>{grossValue.name}</p>
          <span>{grossValue.value}</span>
        </div>
      </div>
    </Box>
  );
}

CardReport.propTypes = {
  title: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  subtitle: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  netValue: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  grossValue: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default CardReport;

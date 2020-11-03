import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Box from '../Box';

function BoxData({ logo, size, title, subtitle, details, footer, ...rest }) {
  const renderHeader = useMemo(() => {
    return (
      <div
        data-logo={!!logo}
        className={styles.header}
        data-title={!logo && !subtitle}
      >
        {logo && <img src={logo} alt="img" />}
        {title && <h1>{title}</h1>}
        {!logo && subtitle && <p>{subtitle}</p>}
      </div>
    );
  }, [logo, title, subtitle]);

  const renderDescription = useMemo(() => {
    const item = details.find(item => item.isDescription);

    return item ? (
      <div className={styles.description}>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </div>
    ) : (
      <></>
    );
  }, [details]);

  const renderDetails = useMemo(() => {
    return (
      <div className={styles.detail}>
        {details
          .filter(item => !item.isDescription)
          .map((item, index) => (
            <div key={index} data-width={item.width || 100}>
              <h1>{item.title}</h1>
              <p>{item.value}</p>
            </div>
          ))}
      </div>
    );
  }, [details]);

  return (
    <div className={styles.container}>
      <Box size={size}>
        {renderHeader}
        {renderDescription}
        {renderDetails}
        {footer}
      </Box>
    </div>
  );
}

BoxData.defaultProps = {
  logo: '',
  title: '',
  size: 'lg',
  subtitle: '',
  details: [],
  footer: <></>,
};

BoxData.propTypes = {
  size: PropTypes.string,
  logo: PropTypes.string,
  footer: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  details: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      isDescription: PropTypes.bool,
    }),
  ),
};

export default BoxData;

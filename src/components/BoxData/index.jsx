import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// components
import Box from '../Box';

function BoxData({
  logo,
  title,
  footer,
  details,
  subtitle,
  useDirection,
  ...rest
}) {
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
      <ul className={styles.detail} data-direction={useDirection}>
        {details
          .filter(item => !item.isDescription)
          .map((item, index) => (
            <li key={index} data-width={item.width || 100}>
              <h1>{item.title}</h1>
              <p>{item.value}</p>
            </li>
          ))}
      </ul>
    );
  }, [details, useDirection]);

  return (
    <Box {...rest}>
      {renderHeader}
      {renderDescription}
      {renderDetails}
      {footer}
    </Box>
  );
}

BoxData.defaultProps = {
  logo: '',
  title: '',
  details: [],
  subtitle: '',
  footer: <></>,
  useDirection: false,
};

BoxData.propTypes = {
  logo: PropTypes.string,
  footer: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  useDirection: PropTypes.bool,
  details: PropTypes.arrayOf(
    PropTypes.shape({
      isDescription: PropTypes.bool,
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
  ),
};

export default BoxData;

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AnimatedNumber from 'animated-number-react';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import Box from '../../components/Box';
import Panel from '../../components/Panel';

function Home() {
  const auth = useSelector(state => state.auth);
  const { locale, currency } = useSelector(state => state.language);

  const [commission, setCommission] = useState(4184.77);

  const renderTitle = useMemo(() => {
    const formatComission = value =>
      new Intl.NumberFormat(locale, {
        currency,
        style: 'currency',
        minimumFractionDigits: 2,
      }).format(value);

    return (
      <>
        <p>{language['home.title']}</p>
        <p>
          <AnimatedNumber value={commission} formatValue={formatComission} />
        </p>
      </>
    );
  }, [locale, currency, commission]);

  return (
    <div>
      <Panel title={renderTitle} />
      <div className={styles.container}>
        <Box>
          <div className={styles.container_report}>
            {language['home.reports'].map((report, index) => (
              <div key={index} className={styles.report}>
                <Link to={report.path}>
                  <i className={report.icon} />
                  <h1>{report.title}</h1>
                </Link>
              </div>
            ))}
          </div>
        </Box>
      </div>
    </div>
  );
}

export default Home;

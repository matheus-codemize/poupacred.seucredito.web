import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedNumber from 'animated-number-react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

function Home() {
  const dispatch = useDispatch();
  const { locale, currency } = useSelector(state => state.language);

  const [commission, setCommission] = useState(4184.77);

  const renderHeader = useMemo(() => {
    const formatComission = value =>
      new Intl.NumberFormat(locale, {
        currency,
        style: 'currency',
        minimumFractionDigits: 2,
      }).format(value);

    return (
      <div className={styles.header}>
        <h1>{language['home.title']}</h1>
        <p>
          <AnimatedNumber value={commission} formatValue={formatComission} />
        </p>
      </div>
    );
  }, [commission]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar} />
      {renderHeader}
      <div className={styles.report}>
        {language['home.reports'].map((report, index) => (
          <Link key={index} to={report.path}>
            <i
              className={report.icon}
              style={{
                backgroundImage: `linear-gradient(180deg, ${report.color}, ${report.secondColor})`,
              }}
            />
            <h1 style={{ color: report.color }}>{report.title}</h1>
            <p>
              <div
                dangerouslySetInnerHTML={{
                  __html: report.subtitle.replace(
                    '[value]',
                    '<span>[value]</span>',
                  ),
                }}
              />
            </p>
            <div>{language['component.button.more'].title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

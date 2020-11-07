import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedNumber from 'animated-number-react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// services
import * as homeApi from '../../services/home';

// redux
import actionsContainer from '../../redux/actions/container';

const languagePage = language['page.home'];

function Home() {
  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const { locale, currency } = useSelector(state => state.language);

  // component state
  const [data, setData] = useState({
    comissao: 0,
    prod_total: 0,
    prod_diaria: 0,
    prod_produto: '-',
  });

  useEffect(() => {
    initComponent();
  }, []);

  async function initComponent() {
    try {
      dispatch(actionsContainer.loading());
      const response = await homeApi.init();

      if (response && typeof response === 'object') {
        setData(prevData => {
          Object.keys(response).forEach(key => {
            prevData[key] = response[key];
          });
          return prevData;
        });
      }
    } catch (err) {
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(locale, {
      currency,
      style: 'currency',
      minimumFractionDigits: 2,
    }).format(value);
  }

  function getValue(key) {
    return typeof data[key] === 'number' ? formatNumber(data[key]) : data[key];
  }

  const renderHeader = useMemo(() => {
    return (
      <div className={styles.header}>
        <h1 dangerouslySetInnerHTML={{ __html: languagePage.title }} />
        <p>
          <AnimatedNumber value={data.comissao} formatValue={formatNumber} />
        </p>
      </div>
    );
  }, [data.comissao]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar} />
      {renderHeader}
      <div className={styles.report}>
        {languagePage.reports.map((report, index) => (
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
                    `<span>${getValue(report.key)}</span>`,
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

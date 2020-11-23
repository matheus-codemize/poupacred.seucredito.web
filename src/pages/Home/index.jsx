import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedNumber from 'animated-number-react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import format from '../../utils/format';
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
  const auth = useSelector(state => state.auth);

  // component state
  const [data, setData] = useState({
    comissao: 0,
    prod_total: 0,
    prod_diaria: 0,
    prod_produto: '',
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
          return { ...prevData };
        });
      }
    } catch (err) {
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  const getValue = useCallback(
    report => {
      const { key, empty, subtitle } = report;
      const value =
        typeof data[key] === 'number' ? format.currency(data[key]) : data[key];

      const text =
        !data[key] && empty
          ? empty
          : subtitle.replace('[value]', `<span>${value}</span>`);

      return <p dangerouslySetInnerHTML={{ __html: text }} />;
    },
    [data],
  );

  const renderHeader = useMemo(() => {
    return (
      <div className={styles.header}>
        <h1 dangerouslySetInnerHTML={{ __html: languagePage.title }} />
        <p>
          <AnimatedNumber value={data.comissao} formatValue={format.currency} />
        </p>
      </div>
    );
  }, [data.comissao]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar} />
      {renderHeader}
      <div className={styles.report}>
        {languagePage.items[auth.type].map((report, index) => (
          <Link
            key={index}
            to={{
              pathname: report.path,
              state:
                auth.type === 'agent'
                  ? {
                      report: {
                        key: report.key,
                        url: report.url,
                        title: report.title,
                      },
                    }
                  : undefined,
            }}
          >
            <i
              className={report.icon}
              style={{
                backgroundImage: `linear-gradient(180deg, ${report.color}, ${report.secondColor})`,
              }}
            />
            <h1 style={{ color: report.color }}>{report.title}</h1>
            {getValue(report)}
            <div>{language['component.button.more'].title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

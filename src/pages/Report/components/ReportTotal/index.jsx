import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import styles from './style.module.css';

// utils
import format from '../../../../utils/format';
import language from '../../../../utils/language';

// components
import Box from '../../../../components/Box';

const languagePage = language['page.report'];

function ReportTotal({ qtd, meta, projecao, vlr_liquido, ...rest }) {
  // redux state
  const navigator = useSelector(state => state.navigator);

  const renderDetails = useMemo(() => {
    return (
      <div className={styles.details}>
        <h1>
          <i className="fa fa-users" />
          {languagePage.labels.countContract}
          <span>{qtd}</span>
        </h1>
        <h1>
          <i className="fa fa-check-double" />
          {languagePage.labels.goal}
          <span>{format.currency(meta)}</span>
        </h1>
        <h1>
          <i className="fas fa-chart-line" />
          {languagePage.labels.projection}
          <span>{format.currency(projecao)}</span>
        </h1>
        <h1>
          <i className="fas fa-money-bill-alt" />
          {languagePage.labels.netValue}
          <span>{format.currency(vlr_liquido)}</span>
        </h1>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <Box size="md">
        <div>
          <Pie
            style={{ maxWidth: 400 }}
            data={{
              ...languagePage.chartTotal,
              datasets: [
                {
                  data: [meta, projecao, vlr_liquido],
                  backgroundColor: ['blue', 'green', 'red'],
                },
              ],
            }}
            options={{ legend: { position: 'bottom' } }}
          />
        </div>
        <div className={styles.details}>
          <h1>
            <i className="fa fa-users" />
            {languagePage.labels.countContract}
            <span>{qtd}</span>
          </h1>
          <h1>
            <i className="fa fa-check-double" />
            {languagePage.labels.goal}
            <span>{format.currency(meta)}</span>
          </h1>
          <h1>
            <i className="fas fa-chart-line" />
            {languagePage.labels.projection}
            <span>{format.currency(projecao)}</span>
          </h1>
          <h1>
            <i className="fas fa-money-bill-alt" />
            {languagePage.labels.netValue}
            <span>{format.currency(vlr_liquido)}</span>
          </h1>
        </div>
        {/* {navigator.window.size.x <= 900 && renderDetails} */}
      </Box>
      {/* {navigator.window.size.x > 900 && <Box size="sm">{renderDetails}</Box>} */}
    </div>
  );
}

ReportTotal.defaultProps = {
  qtd: 30,
  meta: 100,
  projecao: 100,
  vlr_liquido: 100,
};

ReportTotal.propTypes = {
  qtd: PropTypes.number,
  meta: PropTypes.number,
  projecao: PropTypes.number,
  vlr_liquido: PropTypes.number,
};

export default ReportTotal;

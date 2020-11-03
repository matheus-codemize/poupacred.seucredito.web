import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import styles from './style.module.css';

// services
import * as crmApi from '../../../../services/crm';

// assets
import backgroundImg from '../../../../assets/images/background/panel/crm.jpg';

// utils
import language from '../../../../utils/language';

// components
import Panel from '../../../../components/Panel';
import BoxData from '../../../../components/BoxData';
import CardList from '../../../../components/CardList';

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

function AnswerCrm() {
  // resources hooks
  const location = useLocation();

  // component state
  const [details, setDetails] = useState(null);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const mailing = _.get(location, 'state.crm', null);
    setDetails(mailing);
  }, [location.state]);

  useEffect(() => {
    if (details && details.codigo) getDataset();
  }, [details]);

  async function getDataset() {
    setDataset([
      {
        status_id: 1,
        cabecalho: [
          { valor: 'Jose Divan Teixeira de Souza' },
          { nome: '999.999.999-99' },
        ],
        rodape: [
          { nome: 'Status', valor: 'Aguardando ação' },
          { nome: 'Data de Agendamento', valor: '04/11/2020' },
        ],
      },
      {
        status_id: 2,
        cabecalho: [
          { valor: 'Jose Divan Teixeira de Souza' },
          { nome: '999.999.999-99' },
        ],
        rodape: [
          { nome: 'Status', valor: 'Atendido' },
          { nome: 'Data de Agendamento', valor: '04/11/2020' },
        ],
      },
    ]);
    // const response = await crmApi.list();
    // setDataset(response.dados);
  }

  function handleMailing() {}

  const renderDataset = useMemo(() => {
    return dataset.map(item => ({
      ...item,
      onClick: handleMailing,
      disabled: item.status_id !== 1,
    }));
  }, [dataset]);

  return (
    details && (
      <Panel
        useDivider
        background={backgroundImg}
        title={languagePage.title}
        subtitle={languagePage.answerTitle}
      >
        <Panel.Body>
          <div className={styles.detail}>
            <BoxData size="sm" {...details} />
          </div>
          <div className={styles.list}>
            <CardList data={renderDataset} />
          </div>
        </Panel.Body>
      </Panel>
    )
  );
}

export default AnswerCrm;

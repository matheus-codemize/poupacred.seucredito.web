import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsContainer from '../../../../redux/actions/container';

// services
import * as crmApi from '../../../../services/crm';

// assets
import backgroundImg from '../../../../assets/images/background/panel/crm.jpg';

// utils
import toast from '../../../../utils/toast';
import language from '../../../../utils/language';

// components
import Panel from '../../../../components/Panel';
import BoxData from '../../../../components/BoxData';
import CardList from '../../../../components/CardList';
import ListEmpty from '../../../../components/ListEmpty';

const languagePage = language['page.crm'];

const statusEnable = [1, 4];

function ListMailingCrm() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [dataset, setDataset] = useState([]);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const mailing = _.get(location, 'state.crm', null);
    setDetails(mailing);
  }, [location.state]);

  useEffect(() => {
    if (details && details.id) getDataset();
  }, [details]);

  async function getDataset() {
    dispatch(actionsContainer.loading());
    const data = await crmApi.getAnswers(details.id);
    setDataset(data);
    dispatch(actionsContainer.close());
  }

  async function handleMailing(item) {
    try {
      dispatch(actionsContainer.loading());

      const { id: solicitacao } = details;
      const response = await crmApi.getAnswer(solicitacao, item.id);
      history.push(`${location.pathname}/atendimento`, {
        crm: { ...response, solicitacao },
      });
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handleBack() {
    history.goBack();
  }

  const renderDataset = useMemo(() => {
    return dataset.map(item => ({
      ...item,
      cabecalho: [{ valor: item.nome }],
      onClick: () => handleMailing(item),
      disabled: !statusEnable.includes(item.status_id),
      rodape: [
        { nome: languagePage.labels.status, valor: item.status },
        {
          nome: languagePage.labels.scheduleDate,
          valor: item.data || languagePage.labels.scheduleDateEmpty,
        },
      ],
    }));
  }, [dataset]);

  return (
    <Panel
      onBack={handleBack}
      background={backgroundImg}
      title={languagePage.title}
      subtitle={languagePage.mailingTitle}
    >
      <Panel.Body>
        <BoxData useDirection {...details} />
        <CardList data={renderDataset} />
      </Panel.Body>
    </Panel>
  );
}

export default ListMailingCrm;

import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsContainer from '../../../../redux/actions/container';

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
import { useDispatch, useSelector } from 'react-redux';
import ListEmpty from '../../../../components/ListEmpty';
import toast from '../../../../utils/toast';

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

const statusEnable = [1, 4];

function AnswerCrm() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const navigator = useSelector(state => state.navigator);

  // component state
  const [dataset, setDataset] = useState([]);
  const [details, setDetails] = useState(null);
  const [mailing, setMailing] = useState(null);

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

      const response = await crmApi.getAnswer(details.id, item.id);
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
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
          nome: languagePage.labels.schedule,
          valor: item.data || languagePage.labels.scheduleEmpty,
        },
      ],
    }));
  }, [dataset]);

  return (
    <Panel
      useDivider
      background={backgroundImg}
      title={languagePage.title}
      subtitle={languagePage.answerTitle}
    >
      <Panel.Body>
        <ListEmpty visible={!details} />
        {details && (
          <>
            <div className={styles.detail}>
              <BoxData useDirection {...details} />
            </div>
            <div className={styles.list}>
              <CardList data={renderDataset} />
            </div>
          </>
        )}
      </Panel.Body>
    </Panel>
  );
}

export default AnswerCrm;

import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
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

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

function AnswerCrm() {
  // resources hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const navigator = useSelector(state => state.navigator);

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

  function handleMailing() {}

  const renderDataset = useMemo(() => {
    return dataset.map(item => ({
      ...item,
      onClick: handleMailing,
      disabled: item.status_id !== 1,
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

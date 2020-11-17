import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// assets
import backgroundImg from '../../../../assets/images/background/panel/proposta.jpg';

// utils
import language from '../../../../utils/language';

// services
import * as propostaApi from '../../../../services/proposta';

// redux
import actionsContainer from '../../../../redux/actions/container';

// components
import Panel from '../../../../components/Panel';
import Timeline from '../../../../components/Timeline';
import ListEmpty from '../../../../components/ListEmpty';

const languagePage = language['page.proposal'];

function HistoryProposal() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const proposal = _.get(location, 'state.proposal', null);
    if (proposal && proposal.id) getDataset(proposal.id);
  }, [location.state]);

  async function getDataset(id) {
    dispatch(actionsContainer.loading());
    const response = await propostaApi.getHistory(id);
    setDataset(
      response.map(item => ({
        ...item,
        title: item.nome,
        time: item.data,
      })),
    );
    dispatch(actionsContainer.close());
  }

  function handleBack() {
    history.goBack();
  }

  return (
    <Panel
      onBack={handleBack}
      background={backgroundImg}
      title={languagePage.title}
      subtitle={languagePage.historyTitle}
    >
      <Panel.Body>
        <Timeline data={dataset} />
      </Panel.Body>
    </Panel>
  );
}

export default HistoryProposal;

import React, { useMemo, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// services
import api from '../../../../services/api';
import * as simulacaoApi from '../../../../services/simulacao';

// utils
import toast from '../../../../utils/toast';
import language from '../../../../utils/language';

// redux
import actions from '../../../../redux/actions/simulation';
import actionsContainer from '../../../../redux/actions/container';

// assets
import backgroundImg from '../../../../assets/images/background/panel/simulacao.jpg';

// components
import Panel from '../../../../components/Panel';
import Button from '../../../../components/Button';
import BoxDataList from '../../../../components/BoxDataList';

const languagePage = language['page.simulation'];

function ProposalSimulation() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const simulation = useSelector(state => state.simulation);
  const { steps, register, stepBlock } = simulation;

  useEffect(() => {
    const simulacao_id = _.get(location, 'state.simulation.simulacao_id', 0);
    dispatch(actions.register({ ...simulation.register, simulacao_id }));
  }, [location.state]);

  async function handleOtherSimulation() {
    try {
      dispatch(actionsContainer.loading());

      if (stepBlock === -1) {
        const response = await simulacaoApi.getReFields(register);
        dispatch(actions.blockStep());
        dispatch(actions.steps([...steps, ...response]));
      }

      history.push('/simulacao/re-simular');
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handleChoose(item) {
    alert('Proposta selecionada');
  }

  const renderData = useMemo(() => {
    const cards = _.get(location, 'state.simulation.cards', []);

    return cards.map(item => {
      item.footer = (
        <Button gradient onClick={() => handleChoose(item)}>
          {languagePage.proposalChoose}
        </Button>
      );
      return item;
    });
  }, [location.state]);

  return (
    <Panel
      background={backgroundImg}
      title={languagePage.proposalTitle}
      subtitle={languagePage.proposalSubtitle}
      actions={[
        {
          onClick: handleOtherSimulation,
          text: languagePage.simulationOther,
          icon: language['component.button.register'].icon,
        },
        {
          onClick: () => history.push('/simulacao'),
          ...language['component.button.cancel'],
        },
      ]}
    >
      <Panel.Body>
        <BoxDataList data={renderData} />
      </Panel.Body>
    </Panel>
  );
}

export default ProposalSimulation;

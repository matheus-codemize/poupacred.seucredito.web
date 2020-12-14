import React, { useMemo, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// services
import * as propostaApi from '../../../../services/proposta';
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
  const auth = useSelector(state => state.auth);
  const simulation = useSelector(state => state.simulation);
  const { steps, register } = simulation;

  useEffect(() => {
    if (!register.simulacao_id) {
      const simulacao_id = _.get(location, 'state.simulation.simulacao_id', 0);
      dispatch(actions.register({ ...simulation.register, simulacao_id }));
    }
  }, [location.state]);

  async function handleOtherSimulation() {
    try {
      dispatch(actionsContainer.loading());

      const response = await simulacaoApi.getReFields(register);
      dispatch(
        actions.blockStep({
          isProposal: false,
          isResimulation: true,
          steps: [...steps, ...response],
        }),
      );

      history.push('/simulacao/re-simular');
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handleCancel() {
    history.push(auth.uid ? '/simulacao' : '/');
  }

  async function handleChoose(card) {
    try {
      if (!auth.uid) {
        return history.push('/login');
      }

      dispatch(actionsContainer.loading());

      const response = await propostaApi.getFields({
        card_id: card.id,
        simulacao_id: register.simulacao_id,
      });
      dispatch(
        actions.blockStep({
          isProposal: true,
          isResimulation: false,
          steps: [...steps, ...response],
          register: { ...register, card_id: card.id },
        }),
      );

      history.push(`/simulacao/propostas/${card.id}`);
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
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
  }, [simulation, location.state]);

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
          onClick: handleCancel,
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

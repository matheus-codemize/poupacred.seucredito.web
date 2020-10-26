import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// services
import api from '../../../../services/api';

// utils
import toast from '../../../../utils/toast';
import language from '../../../../utils/language';

// redux
import actions from '../../../../redux/actions/simulation';
import actionsNavigator from '../../../../redux/actions/navigator';

// components
import Panel from '../../../../components/Panel';
import Button from '../../../../components/Button';
import BoxDataList from '../../../../components/BoxDataList';

const languagePage = language['page.simulation'];

function ProposalSimulation() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const simulation = useSelector(state => state.simulation);
  const { steps, register } = simulation;

  const [data, setData] = useState([]);

  useEffect(() => {
    const simulacao_id = _.get(location, 'state.simulation.simulacao_id', 0);
    const cards = _.get(location, 'state.simulation.cards', []);

    dispatch(actions.register({ ...simulation.register, simulacao_id }));
    setData(
      cards.map(item => {
        item.title = item.nome;
        if (Array.isArray(item.blocos)) {
          item.details = item.blocos.map(bloco => ({
            title: bloco.nome,
            description: bloco.valor,
          }));
        }
        item.footer = (
          <Button gradient onClick={() => handleChoose(item)}>
            {languagePage.proposalChoose}
          </Button>
        );
        return item;
      }),
    );
  }, [location.state]);

  async function handleOtherSimulation() {
    try {
      dispatch(actionsNavigator.startLoading());

      const url = '/re-simulacoes/produtos/campos';
      const response = await api.post(url, register);
      dispatch(actions.nextStep());
      dispatch(actions.steps([...steps, ...response]));

      history.replace('/simulacao/re-simulacao');
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsNavigator.finishLoading());
    }
  }

  function handleChoose(item) {
    alert('Proposta selecionada');
  }

  return (
    <Panel
      title={languagePage.proposalTitle}
      subtitle={languagePage.proposalSubtitle}
      actions={[
        {
          icon: 'fas fa-check',
          onClick: handleOtherSimulation,
          text: languagePage.simulationOther,
        },
      ]}
    >
      <Panel.Body>
        <BoxDataList data={data} />
      </Panel.Body>
    </Panel>
  );
}

export default ProposalSimulation;

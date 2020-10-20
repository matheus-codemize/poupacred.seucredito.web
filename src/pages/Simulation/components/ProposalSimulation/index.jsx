import React, { useMemo } from 'react';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';

// utils
import language from '../../../../utils/language';

// components
import Panel from '../../../../components/Panel';
import Button from '../../../../components/Button';
import BoxDataList from '../../../../components/BoxDataList';

const languagePage = language['page.simulation'];

function ProposalSimulation() {
  const history = useHistory();
  const location = useLocation();

  function handleOtherSimulation() {
    history.replace('/simulacao/novo');
  }

  function handleChoose(item) {
    alert('Proposta selecionada');
  }

  const renderData = useMemo(() => {
    const data = _.get(location.state, 'simulation.cards', []);
    return data.map(item => {
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
    });
  }, [location.state]);

  return (
    <Panel
      onCreate={handleOtherSimulation}
      title={languagePage.proposalTitle}
      subtitle={languagePage.proposalSubtitle}
      labelCreate={languagePage.simulationOther}
    >
      <Panel.Body>
        <BoxDataList data={renderData} />
      </Panel.Body>
    </Panel>
  );
}

export default ProposalSimulation;

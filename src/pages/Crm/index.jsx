import React, { useState } from 'react';

import TitleSection from '../../components/TitleSection';
import Input from '../../components/Input';
import Button from '../../components/Button';
import InputDateRange from '../../components/InputDateRange';

import './styles.css';
import Card from '../../components/Card';
import InfoField from '../../components/InfoField';
function Crm() {
  const [showFilter, setShowFilter] = useState(false);

  function handleShowFilter() {
    setShowFilter(!showFilter);
  }
  return (
    <div id="crm-page">
      <TitleSection title="CRM" small={true}>
        <div className="filter-actions">
          <button type="button" className="outline" onClick={handleShowFilter}>
            Filtrar Dados
          </button>
          <button type="button" className="outline">
            Limpar Filtros
          </button>
        </div>
        <div className={`filters ${showFilter ? 'visible' : ''}`}>
          <Input
            htmlType="text"
            label="Convênio"
            name="convenio"
            placeholder="Selecione o convênio"
          />
          <Input
            htmlType="text"
            label="Status"
            name="status"
            placeholder="Selecione o status"
          />
          <InputDateRange />
          <Button type="button" color="success" icon="fa-filter">
            Filtrar
          </Button>
        </div>
      </TitleSection>
      <div className="content">
        <Card>
          <div className="card-header">
            <span className="card-title">Solicitacao: 32434</span>
            <span className="card-title">Ativo</span>
          </div>
          <div className="crm-info">
            <InfoField title="Convênio" info="36613 - GOVERNO SP" />
            <InfoField title="Qtde. Solicitada" info="2" />
            <InfoField title="Qtde. Trabalhada" info="2" />
            <InfoField title="Prazo para trabalhar" info="20/10/2020" />
          </div>
          <Button>Atender Mailing</Button>
        </Card>
      </div>
    </div>
  );
}

export default Crm;

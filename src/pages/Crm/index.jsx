import React, { useState } from 'react';

import TitleSection from '../../components/TitleSection';
import Input from '../../components/Input';
import Button from '../../components/Button';
import InputDateRange from '../../components/InputDateRange';

import './styles.css';
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
      <p>cards...</p>
    </div>
  );
}

export default Crm;

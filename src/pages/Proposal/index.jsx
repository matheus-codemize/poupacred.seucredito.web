import React, { useState } from 'react';
import TitleSection from '../../components/TitleSection';
import Input from '../../components/Input';
import InputDateRange from '../../components/InputDateRange';
import Button from '../../components/Button';

import './styles.css';
import InfoField from '../../components/InfoField';
import Card from '../../components/Card';
function Proposal() {
  const [showFilter, setShowFilter] = useState(false);

  function handleShowFilter() {
    setShowFilter(!showFilter);
  }
  return (
    <div id="proposal-page">
      <TitleSection title="Propostas" small={true}>
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
            label="Filtrar Por"
            name="filter_type"
            placeholder="Selecione o filtro"
          />
          <Input
            htmlType="text"
            label="Número da Proposta"
            name="proposal_number"
            placeholder=""
          />
          <Input htmlType="text" label="CPF" name="cpf" placeholder="" />
          <Input htmlType="text" label="Nome" name="name" placeholder="" />
          <InputDateRange />
          <Input htmlType="text" label="Banco" name="bank" placeholder="" />
          <Input
            htmlType="text"
            label="Convenio"
            name="convenio"
            placeholder=""
          />
          <Input
            htmlType="text"
            label="Produto"
            name="product"
            placeholder=""
          />
          <Button type="button" color="success" icon="fa-filter">
            Filtrar
          </Button>
        </div>
      </TitleSection>
      <div className="content">
        <Card>
          <div className="card-header">
            <img
              src="https://kontaazul.com.br/wp-content/uploads/2020/02/emprestimo-no-banco-bmg-consignado.png"
              alt="Banco"
              className="bank-logo"
            />
            {/* <span className="bank-title">BMG</span> */}
          </div>
          <div className="client-info">
            <span className="client-name">Fulano de Tal</span>
            <span className="client-cpf">111.222.333-44</span>
          </div>
          <div className="proposal-info">
            <InfoField title="Nº Proposta" info="342443" />
            <InfoField title="Status" info="Proposta Regularizada" />
            <InfoField title="Convênio" info="INSS" />
            <InfoField title="Setor Convênio" info="INSS" />
            <InfoField title="Produto" info="Novo" />
          </div>
        </Card>
        <Card>
          <div className="card-header">
            <img
              src="https://www.meioemensagem.com.br/wp-content/uploads/2018/03/Santander_NovaMarca_575.png"
              alt="Banco"
              className="bank-logo"
            />
            {/* <span className="bank-title">Santander</span> */}
          </div>
          <div className="client-info">
            <span className="client-name">Fulano de Tal</span>
            <span className="client-cpf">111.222.333-44</span>
          </div>
          <div className="proposal-info">
            <InfoField title="Nº Proposta" info="342443" />
            <InfoField title="Status" info="Proposta Regularizada" />
            <InfoField title="Convênio" info="INSS" />
            <InfoField title="Setor Convênio" info="INSS" />
            <InfoField title="Produto" info="Novo" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Proposal;

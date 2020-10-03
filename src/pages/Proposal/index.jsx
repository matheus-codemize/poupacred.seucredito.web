import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

// services
import api from '../../services/api';

// utils
import language from '../../utils/language';

// components
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Select from '../../components/Select';

function Proposal({ ...rest }) {
  const dispatch = useDispatch();
  const navigator = useSelector(state => state.navigator);

  const [filter, setFilter] = useState({});
  const [produtos, setProdutos] = useState([]);

  function handleChangeFilter(event) {
    const { id, value } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  }

  return (
    <div>
      <Panel title={language['proposal.title']}>
        <Panel.Search>
          <Select
            id="filtro_por"
            options={produtos}
            onChange={handleChangeFilter}
            value={filter.filtro_por || ''}
            {...language['proposal.filter.input'].filtro_por}
          />
          <Input
            id="proposta"
            onChange={handleChangeFilter}
            value={filter.proposta || ''}
            {...language['proposal.filter.input'].proposta}
          />
          <Input
            id="cpf"
            onChange={handleChangeFilter}
            value={filter.cpf || ''}
            {...language['proposal.filter.input'].cpf}
          />
          <Input
            id="nome"
            onChange={handleChangeFilter}
            value={filter.nome || ''}
            {...language['proposal.filter.input'].nome}
          />
          <Input
            id="periodo"
            onChange={handleChangeFilter}
            value={filter.periodo || ''}
            {...language['proposal.filter.input'].periodo}
          />
          <Select
            id="banco"
            options={produtos}
            onChange={handleChangeFilter}
            value={filter.banco || ''}
            {...language['proposal.filter.input'].banco}
          />
          <Select
            id="setor"
            options={produtos}
            onChange={handleChangeFilter}
            value={filter.setor || ''}
            {...language['proposal.filter.input'].setor}
          />
          <Select
            id="convenio"
            options={produtos}
            onChange={handleChangeFilter}
            value={filter.convenio || ''}
            {...language['proposal.filter.input'].convenio}
          />
          <Select
            id="produto"
            options={produtos}
            onChange={handleChangeFilter}
            value={filter.produto || ''}
            {...language['proposal.filter.input'].produto}
          />
        </Panel.Search>
      </Panel>
    </div>
  );
}

export default Proposal;

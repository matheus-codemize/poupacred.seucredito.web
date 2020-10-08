import React, { useEffect, useState, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// redux
import actionsNavigator from '../../redux/actions/navigator';

// services
import api from '../../services/api';
import * as produtoApi from '../../services/produto';
import * as convenioApi from '../../services/convenio';

// resources
import inputsize from '../../resources/data/inputsize/proposal';

// utils
import toast from '../../utils/toast';
import language from '../../utils/language';
import getColSize from '../../utils/getColSize';

// components
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import BoxData from '../../components/BoxData';
import InputDateRange from '../../components/InputDateRange';

function Proposal({ ...rest }) {
  const dispatch = useDispatch();
  const navigator = useSelector(state => state.navigator);

  const [filter, setFilter] = useState({});
  const [bancos, setBancos] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [convenios, setConvenios] = useState([]);

  useEffect(() => {
    initComponent();
  }, []);

  async function initComponent() {
    dispatch(actionsNavigator.startLoading());
    await Promise.all([getProdutos(), getConvenios()]);
    await getDados();
  }

  async function getProdutos() {
    const data = await produtoApi.list();
    setProdutos(data);
  }

  async function getConvenios() {
    const data = await convenioApi.list();
    setConvenios(data);
  }

  async function getDados() {
    try {
      dispatch(actionsNavigator.startLoading());

      // const url = ``;
      // const dados = await api.get(url);
      // setDataset(dados);
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      setTimeout(() => dispatch(actionsNavigator.finishLoading()), 2000);
    }
  }

  function handleChangeFilter(event) {
    const { id, value } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  }

  function handleDetails(id) {}

  const getCol = useCallback(
    id => {
      return getColSize(id, inputsize);
    },
    [navigator.window.size.x],
  );

  return (
    <div>
      <Panel onSearch={getDados} title={language['proposal.title']}>
        <Panel.Search>
          <Select
            col={getCol}
            id="filtro_por"
            options={produtos}
            onChange={handleChangeFilter}
            value={filter.filtro_por || ''}
            {...language['proposal.filter.input'].filtro_por}
          />
          <Input
            col={getCol}
            id="proposta"
            value={filter.proposta || ''}
            onChange={handleChangeFilter}
            {...language['proposal.filter.input'].proposta}
          />
          <Input
            id="cpf"
            col={getCol}
            value={filter.cpf || ''}
            onChange={handleChangeFilter}
            {...language['proposal.filter.input'].cpf}
          />
          <Input
            id="nome"
            col={getCol}
            value={filter.nome || ''}
            onChange={handleChangeFilter}
            {...language['proposal.filter.input'].nome}
          />
          <InputDateRange
            id="periodo"
            col={getCol}
            onChange={handleChangeFilter}
            value={filter.periodo || null}
            {...language['proposal.filter.input'].periodo}
          />
          <Select
            id="banco"
            col={getCol}
            options={bancos}
            value={filter.banco || ''}
            onChange={handleChangeFilter}
            {...language['proposal.filter.input'].banco}
          />
          <Select
            col={getCol}
            id="convenio"
            options={convenios}
            value={filter.convenio || ''}
            onChange={handleChangeFilter}
            {...language['proposal.filter.input'].convenio}
          />
          <Select
            id="produto"
            col={getCol}
            options={produtos}
            value={filter.produto || ''}
            onChange={handleChangeFilter}
            {...language['proposal.filter.input'].produto}
          />
        </Panel.Search>
        <Panel.Body>
          <div className={styles.container_dataset}>
            <BoxData
              logo="data:image/png;base64,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"
              title="Banco BMG"
              // subtitle="Ativo"
              details={[
                {
                  title: 'Maria do Rosário',
                  description: '759.349.380-61',
                  isDescription: true,
                },
                {
                  title: 'Nº Proposta',
                  description: '566598',
                },
                {
                  title: 'Status',
                  description: 'Proposta Regularizada',
                },
                {
                  title: 'Convênio',
                  description: 'INSS',
                },
                {
                  title: 'Produto',
                  description: 'NOVO',
                },
              ]}
              footer={
                <Button onClick={() => handleDetails()}>
                  {language['component.button.details'].text}
                </Button>
              }
            />
          </div>
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default Proposal;

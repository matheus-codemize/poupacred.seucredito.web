import React, { useEffect, useState, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// redux
import actionsContainer from '../../redux/actions/container';

// assets
import backgroundImg from '../../assets/images/background/panel/proposta.jpg';

// services
import * as bancoApi from '../../services/banco';
import * as produtoApi from '../../services/produto';
import * as convenioApi from '../../services/convenio';
import * as propostaApi from '../../services/proposta';

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
import BoxDataList from '../../components/BoxDataList';
import InputDateRange from '../../components/InputDateRange';

// components internal
import Details from './components/DetailsProposal';
import History from './components/HistoryProposal';

const languagePage = language['page.proposal'];
const languageForm = language['component.form.props'];

function Proposal() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const navigator = useSelector(state => state.navigator);

  // component state
  const [filter, setFilter] = useState({});
  const [bancos, setBancos] = useState([]);
  const [status, setStatus] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, current: 1 });

  useEffect(() => {
    if (location.pathname === '/proposta') {
      initComponent();
    }
  }, [location.pathname]);

  useEffect(() => {
    getDados();
  }, [pagination.current]);

  async function initComponent() {
    dispatch(actionsContainer.loading());
    await Promise.all([
      getStatus(),
      getBancos(),
      getProdutos(),
      getConvenios(),
    ]);
    await getDados();
  }

  async function getStatus() {
    const data = await propostaApi.getStatus();
    setStatus(data);
  }

  async function getProdutos() {
    const data = await produtoApi.list();
    setProdutos(data);
  }

  async function getBancos() {
    const data = await bancoApi.list();
    setBancos(data);
  }

  async function getConvenios() {
    const data = await convenioApi.list();
    setConvenios(data);
  }

  async function getDados() {
    try {
      dispatch(actionsContainer.loading());

      const response = await propostaApi.list({ ...filter, pagination });
      setDataset(response.dados);
      setPagination(prevPagination => ({
        ...prevPagination,
        total: response.total,
      }));
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handleChangeFilter(event) {
    const { id, value } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  }

  function handleDetails(item) {
    history.push('/proposta/detalhes', { proposal: item });
  }

  const getCol = useCallback(
    id => {
      return getColSize(id, inputsize);
    },
    [navigator.window.size.x],
  );

  const renderDadaset = useMemo(() => {
    return dataset.map(item => ({
      ...item,
      footer: (
        <Button
          gradient
          onClick={() => handleDetails(item)}
          {...language['component.button.details']}
        />
      ),
    }));
  }, [dataset]);

  if (location.pathname === '/proposta/detalhes') {
    return <Details />;
  }

  if (location.pathname === '/proposta/detalhes/historico') {
    return <History />;
  }

  return (
    <div>
      <Panel
        onSearch={getDados}
        title={languagePage.title}
        background={backgroundImg}
      >
        <Panel.Search>
          <Select
            col={getCol}
            id="status"
            options={status}
            value={filter.status || ''}
            onChange={handleChangeFilter}
            {...languageForm.status}
          />
          <Input
            col={getCol}
            id="proposta"
            value={filter.proposta || ''}
            onChange={handleChangeFilter}
            {...languageForm.proposta}
          />
          <Input
            id="cpf"
            col={getCol}
            value={filter.cpf || ''}
            onChange={handleChangeFilter}
            {...languageForm.cpf}
          />
          <Input
            id="nome"
            col={getCol}
            value={filter.nome || ''}
            onChange={handleChangeFilter}
            {...languageForm.nome}
          />
          <InputDateRange
            id="periodo"
            col={getCol}
            onChange={handleChangeFilter}
            value={filter.periodo || null}
            {...languageForm.periodo}
          />
          <Select
            id="banco"
            col={getCol}
            options={bancos}
            value={filter.banco || ''}
            onChange={handleChangeFilter}
            {...languageForm.banco}
          />
          <Select
            col={getCol}
            id="convenio"
            options={convenios}
            value={filter.convenio || ''}
            onChange={handleChangeFilter}
            {...languageForm.convenio}
          />
          <Select
            id="produto"
            col={getCol}
            options={produtos}
            value={filter.produto || ''}
            onChange={handleChangeFilter}
            {...languageForm.produto}
          />
        </Panel.Search>
        <Panel.Body>
          <BoxDataList
            data={renderDadaset}
            pagination={pagination}
            onPagination={setPagination}
          />
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default Proposal;

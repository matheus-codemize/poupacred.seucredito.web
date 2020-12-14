import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/simulation';
import actionsContainer from '../../redux/actions/container';

// assets
import backgroundImg from '../../assets/images/background/panel/simulacao.jpg';

// services
import * as simulacaoApi from '../../services/simulacao';

// utils
import toast from '../../utils/toast';
import language from '../../utils/language';

// components
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Select from '../../components/Select';
import CardList from '../../components/CardList';

// components internal
import Create from './components/CreateSimulation';
import Proposal from './components/ProposalSimulation';

const languagePage = language['page.simulation'];
const languageForm = language['component.form.props'];

function Simulation() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);

  // component state
  const [filter, setFilter] = useState({});
  const [status, setStatus] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, total: 0 });

  useEffect(() => {
    if (location.pathname === '/simulacao' && auth.uid) {
      initComponent();
    }
  }, [auth, pagination.current, location.pathname]);

  async function initComponent() {
    dispatch(actionsContainer.loading());
    await Promise.all([getStatus()]).then(getDados);
  }

  async function getStatus() {
    const data = await simulacaoApi.getStatus();
    setStatus(data);
  }

  async function getDados() {
    try {
      dispatch(actionsContainer.loading());

      const response = await simulacaoApi.list({ ...filter, pagination });
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

  function handleCreate() {
    history.push('/simulacao/novo');
    dispatch(actions.init());
  }

  async function handleClickSimulation(item) {
    try {
      const { id, status_id } = item;

      if (id) {
        switch (status_id) {
          case 1:
            break;

          case 2:
            // Processando Margem - nada acontece
            break;

          case 3: // Finalizado - redireciona para a tela de propostas pós simulação
            dispatch(actions.register(item));
            dispatch(actionsContainer.loading());
            const response = await simulacaoApi.find(item.id);
            dispatch(actionsContainer.close());
            history.push('/simulacao/propostas', {
              simulation: { cards: response.cards },
            });
            break;

          default:
            break;
        }
      }
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  const renderDataset = useMemo(() => {
    return dataset.map(item => ({
      header: (
        <div className={styles.dataset_header}>
          <h1>{item.nome}</h1>
          <p>{item.cpf}</p>
        </div>
      ),
      footer: (
        <div className={styles.dataset_footer}>
          <p>{item.criado_em}</p>
          <p>{item.status}</p>
        </div>
      ),
      disabled: item.status_id === 2,
      onClick: () => handleClickSimulation(item),
    }));
  }, [dataset]);

  if (location.pathname === '/simulacao/propostas') {
    return <Proposal />;
  }

  if (location.pathname !== '/simulacao' || !auth.uid) {
    return <Create />;
  }

  return (
    <div>
      <Panel
        onSearch={getDados}
        title={languagePage.title}
        background={backgroundImg}
        actions={[
          {
            onClick: handleCreate,
            text: languagePage.create,
            icon: 'fas fa-calculator',
          },
        ]}
      >
        <Panel.Search>
          <Select
            id="status"
            options={status}
            value={filter.status || ''}
            onChange={handleChangeFilter}
            {...languageForm.status}
          />
          {auth.type !== 'client' && (
            <Input
              id="cpf"
              type="cpf"
              value={filter.cpf || ''}
              onChange={handleChangeFilter}
              {...languageForm.cpf}
            />
          )}

          {auth.type !== 'client' && (
            <Input
              id="nome"
              value={filter.nome || ''}
              onChange={handleChangeFilter}
              {...languageForm.nome}
            />
          )}
        </Panel.Search>
        <Panel.Body>
          <CardList
            data={renderDataset}
            pagination={pagination}
            onPagination={setPagination}
          />
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default Simulation;

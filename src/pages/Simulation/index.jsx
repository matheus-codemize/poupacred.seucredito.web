import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsNavigator from '../../redux/actions/navigator';

// services
import api from '../../services/api';

// utils
import toast from '../../utils/toast';
import language from '../../utils/language';
import cpfFormat from '../../utils/format/cpf';

// components
import Panel from '../../components/Panel';
import Select from '../../components/Select';
import CardList from '../../components/CardList';

// components internal
import Create from './components/CreateSimulation';

const languagePage = language['page.simulation'];
const languageForm = language['component.form.props'];

function Simulation() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [dataset, setDataset] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, total: 0 });

  useEffect(() => {
    if (location.pathname === '/simulacao') {
      getDados();
    }
  }, [pagination.current, location.pathname]);

  function handleChangeFilter(event) {
    let { id, value } = event.target;

    switch (id) {
      case 'cpf':
        value = cpfFormat(value, filter.cpf);
        break;

      default:
        break;
    }

    setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  }

  function handleCreate() {
    history.push('/simulacao/novo');
  }

  async function getDados() {
    try {
      dispatch(actionsNavigator.startLoading());

      const url = '/simulacoes/listar';
      const response = await api.post(url, { ...filter, pagination });
      setDataset(response.dados);
      setPagination(prevPagination => ({
        ...prevPagination,
        total: response.total,
      }));
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsNavigator.finishLoading());
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
      disabled: item.status === '',
      onClick: () =>
        history.push(
          `/simulacao/${
            item.status.toLowerCase().includes('rascunho')
              ? 'rascunho'
              : 'margem'
          }`,
          { id: item.id },
        ),
    }));
  }, [dataset]);

  if (location.pathname !== '/simulacao') {
    return <Create />;
  }

  return (
    <div>
      <Panel
        onSearch={getDados}
        onCreate={handleCreate}
        title={languagePage.title}
        labelCreate={languagePage.create}
      >
        <Panel.Search>
          <Select
            id="status"
            options={[]}
            value={filter.status || ''}
            onChange={handleChangeFilter}
            {...languageForm.status}
          />
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

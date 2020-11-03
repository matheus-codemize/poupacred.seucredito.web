import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// redux
import actionsContainer from '../../redux/actions/container';

// assets
import backgroundImg from '../../assets/images/background/panel/crm.jpg';

// utils
import toast from '../../utils/toast';
import moment from '../../utils/moment';
import language from '../../utils/language';

// services
import * as crmApi from '../../services/crm';

// components
import Panel from '../../components/Panel';
import Button from '../../components/Button';
import Select from '../../components/Select';
import BoxDataList from '../../components/BoxDataList';
import InputDateRange from '../../components/InputDateRange';

// components internal
import Create from './components/CreateCrm';
import Answer from './components/AnswerCrm';

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

const dataTest = [
  {
    codigo: 123,
    status_id: 1,
    status: 'Ativo',
    blocos: [
      {
        nome: 'Convênio',
        valor: '26613 - Governo SP',
      },
      {
        nome: 'Qtde. Solicitada',
        valor: 5,
        width: 50,
      },
      {
        nome: 'Qtde. Trabalhada',
        valor: 2,
        width: 50,
      },
      {
        nome: 'Prazo para trabalhar',
        valor: '05/11/2020',
      },
    ],
  },
  {
    codigo: 159,
    status_id: 2,
    status: 'Reprovado',
    blocos: [
      {
        nome: 'Convênio',
        valor: '26613 - Governo SP',
      },
      {
        nome: 'Qtde. Solicitada',
        valor: 0,
        width: 50,
      },
      {
        nome: 'Qtde. Trabalhada',
        valor: 0,
        width: 50,
      },
      {
        nome: 'Prazo para trabalhar',
        valor: '',
      },
    ],
  },
];

function Crm() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [filter, setFilter] = useState({});
  const [status, setStatus] = useState([]);
  const [dataset, setDataset] = useState([...dataTest]);
  const [convenios, setConvenios] = useState([]);
  const [tabulacaos, setTabulacaos] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, current: 1 });

  useEffect(() => {
    if (location.pathname === '/crm') {
      // initComponent();
    }
  }, [location.pathname]);

  async function initComponent() {
    dispatch(actionsContainer.loading());
    await Promise.all([getStatus(), getConvenios(), getTabulacaos()]).then(
      getDataset,
    );
  }

  async function getConvenios() {
    const data = await crmApi.getConvenios();
    setConvenios(data);
  }

  async function getStatus() {
    const data = await crmApi.getStatus();
    setStatus(data);
  }

  async function getTabulacaos() {
    const data = await crmApi.getTabulacaos();
    setTabulacaos(data);
  }

  async function getDataset() {
    try {
      dispatch(actionsContainer.loading());

      const { periodo, ...restFilter } = filter;
      const response = await crmApi.list({ ...restFilter, pagination });
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

  function handleFilter(event) {
    const dataFilter = { ...filter };
    const { id, value } = event.target;

    switch (id) {
      case 'periodo':
        dataFilter[id] = value;
        dataFilter.prazo_min = moment(value[0]).isValid()
          ? moment(value[0]).format('DD/MM/YYYY')
          : null;
        dataFilter.prazo_max = moment(value[1]).isValid()
          ? moment(value[1]).format('DD/MM/YYYY')
          : null;
        return setFilter(dataFilter);

      default:
        break;
    }

    setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  }

  function handleMailing(mailing) {
    delete mailing.footer;
    history.push('/crm/atendimento', { crm: mailing });
  }

  const renderDataset = useMemo(() => {
    return dataset.map(item => {
      item.subtitle = item.status;
      item.title = `${languagePage.labels.solicitation}: ${item.codigo}`;
      item.footer = (
        <Button
          gradient
          disabled={item.status_id !== 1}
          onClick={() => handleMailing({ ...item })}
        >
          {languagePage.buttons.answer}
        </Button>
      );

      return item;
    });
  }, [dataset]);

  function handleCreate() {
    history.push('/crm/novo');
  }

  if (location.pathname.includes('novo')) {
    return <Create />;
  }

  if (location.pathname.includes('atendimento')) {
    return <Answer />;
  }

  return (
    <div>
      <Panel
        onSearch={getDataset}
        title={languagePage.title}
        background={backgroundImg}
        actions={[
          {
            onClick: handleCreate,
            ...language['component.button.solicitation'],
          },
        ]}
      >
        <Panel.Search>
          <Select
            multiple
            id="lista_convenios"
            options={convenios}
            onChange={handleFilter}
            value={filter.lista_convenios || ''}
            {...languageForm.convenio}
          />
          <Select
            multiple
            id="lista_tabulacoes"
            options={tabulacaos}
            onChange={handleFilter}
            value={filter.lista_tabulacoes || ''}
            {...languageForm.tabulacao}
          />
          <Select
            multiple
            options={status}
            id="lista_status"
            onChange={handleFilter}
            value={filter.lista_status || ''}
            {...languageForm.status}
          />
          <InputDateRange
            id="periodo"
            options={convenios}
            onChange={handleFilter}
            value={filter.periodo || ''}
            {...languageForm.periodo}
          />
        </Panel.Search>
        <Panel.Body>
          <BoxDataList
            data={renderDataset}
            pagination={pagination}
            onPagination={setPagination}
          />
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default Crm;

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// redux
import actionsNavigator from '../../redux/actions/navigator';
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
import Select from '../../components/Select';
import BoxDataList from '../../components/BoxDataList';
import InputDateRange from '../../components/InputDateRange';

// components internal
import Create from './components/CreateCrm';

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

function Crm() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [filter, setFilter] = useState({});
  const [status, setStatus] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [tabulacaos, setTabulacaos] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, current: 1 });

  useEffect(() => {
    if (location.pathname === '/crm') {
      initComponent();
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

  function handleCreate() {
    history.push('/crm/novo');
  }

  if (location.pathname.includes('novo')) {
    return <Create />;
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
            text: languagePage.create,
            icon: language['component.button.plus'].icon,
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
            data={dataset}
            pagination={pagination}
            onPagination={setPagination}
          />
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default Crm;

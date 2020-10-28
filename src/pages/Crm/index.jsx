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
import language from '../../utils/language';

// services
import api from '../../services/api';
import * as convenioApi from '../../services/convenio';

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
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [filter, setFilter] = useState({});
  const [dataset, setDataset] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, current: 1 });

  useEffect(() => {
    initComponent();
  }, []);

  async function initComponent() {
    dispatch(actionsContainer.loading());
    await getConvenio().then(getDataset);
  }

  async function getConvenio() {
    const data = await convenioApi.list();
    setConvenios(data);
  }

  async function getDataset() {
    try {
      dispatch(actionsContainer.loading());

      const url = '/crm/listar';
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
      dispatch(actionsContainer.close());
    }
  }

  function handleFilter(event) {
    const { id, value } = event.target;
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
            id="convenio"
            options={convenios}
            onChange={handleFilter}
            value={filter.convenio || ''}
            {...languageForm.convenio}
          />
          <Select
            id="status"
            onChange={handleFilter}
            value={filter.status || ''}
            options={languagePage.list.status}
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

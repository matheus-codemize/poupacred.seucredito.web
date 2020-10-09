import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

// redux
import actionsNavigator from '../../redux/actions/navigator';

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

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

function Crm() {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [dataset, setDataset] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [pagination, setPagination] = useState({
    size: 20,
    total: 0,
    current: 1,
  });

  useEffect(() => {
    initComponent();
  }, []);

  async function initComponent() {
    dispatch(actionsNavigator.startLoading());
    await getConvenio().then(getDataset);
  }

  async function getConvenio() {
    const data = await convenioApi.list();
    setConvenios(data);
  }

  async function getDataset() {
    try {
      dispatch(actionsNavigator.startLoading());

      // const url = '/crm/listar';
      // const response = await api.post(url, { ...filter, pagination });
      // setDataset(response.dados);
      // setPagination(prevPagination => ({
      //   ...prevPagination,
      //   total: response.total,
      // }));
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsNavigator.finishLoading());
    }
  }

  function handleFilter(event) {
    const { id, value } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  }

  function handleCreate() {}

  function renderFooterBoxData(item) {
    return <></>;
  }

  return (
    <div>
      <Panel
        onSearch={getDataset}
        onCreate={handleCreate}
        title={languagePage.title}
        labelCreate={languagePage.create}
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
            dataFooter={renderFooterBoxData}
          />
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default Crm;
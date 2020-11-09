import React, { useEffect, useState, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// utils
import toast from '../../utils/toast';
import language from '../../utils/language';

// services
import api from '../../services/api';

// redux
import actionsContainer from '../../redux/actions/container';

// components
import Panel from '../../components/Panel';
import ListEmpty from '../../components/ListEmpty';
import InputDateRange from '../../components/InputDateRange';

// component internal
import Card from './components/Card';

const languagePage = language['page.report'];
const languageForm = language['component.form.props'];

function Report() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [key, setKey] = useState('');
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState({});
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const state = _.get(location, 'state.report', null);

    if (state) {
      setKey(prevKey => state.key || prevKey);
      setUrl(prevUrl => state.url || prevUrl);
      setTitle(prevTitle => state.title || prevTitle);
    }
  }, [location.state]);

  useEffect(() => {
    if (url) getDataset();
  }, [url]);

  async function getDataset() {
    try {
      dispatch(actionsContainer.loading());

      const data = {};

      switch (key) {
        case 'prod_diaria':
        case 'prod_produto':
          data.data_fim = filter.data_fim;
          data.data_inicio = filter.data_inicio;
          break;

        default:
          break;
      }

      const response = await api.post(url, data);
      setDataset(response);
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handleChange(event) {
    const { id, value } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  }

  const renderSearch = useMemo(() => {
    let component = <></>;

    switch (key) {
      case 'prod_diaria':
      case 'prod_produto':
        component = (
          <>
            <InputDateRange
              id="periodo"
              onChange={handleChange}
              value={filter.periodo || ''}
              {...languageForm.periodo}
            />
          </>
        );
        break;

      default:
        return;
    }

    return <Panel.Search>{component}</Panel.Search>;
  }, [key, filter]);

  const renderData = useCallback(
    (data, index) => {
      let component = <></>;

      switch (key) {
        case 'prod_diaria':
        case 'prod_produto':
          component = <Card {...data} />;
          break;

        default:
          break;
      }

      return <div key={index}>{component}</div>;
    },
    [key],
  );

  return (
    <Panel
      subtitle={title}
      title={languagePage.title}
      actions={[
        {
          onClick: () => history.goBack(),
          ...language['component.button.back'],
        },
      ]}
      onSearch={
        ['prod_diaria', 'prod_produto'].includes(key) ? getDataset : undefined
      }
    >
      {renderSearch}
      <Panel.Body>
        <ListEmpty visible={!dataset.length} />
        {dataset.length > 0 && (
          <div className={styles.container}>{dataset.map(renderData)}</div>
        )}
      </Panel.Body>
    </Panel>
  );
}

export default Report;

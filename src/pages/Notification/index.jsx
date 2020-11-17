import React, { useState, useEffect, useRef, useCallback } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// assets
import backgroundImg from '../../assets/images/background/panel/proposta.jpg';

// utils
import language from '../../utils/language';

// services
import * as notificacaoApi from '../../services/notificacao';

// redux
import actionsContainer from '../../redux/actions/container';

// components
import Panel from '../../components/Panel';
import Timeline from '../../components/Timeline';

const languagePage = language['page.notification'];

function Notification() {
  const containerRef = useRef(null);
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [dataset, setDataset] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, total: 0 });

  const getNotification = useCallback(() => {
    const windownHeight = window.innerHeight;
    const { bottom } = containerRef.current.getBoundingClientRect();

    if (
      pagination.total > pagination.current &&
      parseInt(bottom) === parseInt(windownHeight)
    ) {
      setPagination(prevPagination => {
        prevPagination.current++;
        return { ...prevPagination };
      });
    }
  }, [pagination]);

  useEffect(() => {
    window.addEventListener('scroll', getNotification);

    return () => {
      window.removeEventListener('scroll', getNotification);
    };
  }, [getNotification]);

  useEffect(() => {
    getDataset();
  }, [pagination.current]);

  async function getDataset() {
    dispatch(actionsContainer.loading());
    const response = await notificacaoApi.list(pagination);
    setDataset(prevDataset =>
      response.dados
        .map(item => ({
          ...item,
          time: item.data,
          title: item.titulo,
          description: item.texto,
        }))
        .concat(prevDataset),
    );
    setPagination(prevPagination => ({
      ...prevPagination,
      total: 5 || response.total,
    }));
    dispatch(actionsContainer.close());
  }

  function handleBack() {
    history.goBack();
  }

  return (
    <Panel
      onBack={handleBack}
      background={backgroundImg}
      title={languagePage.title}
    >
      <Panel.Body>
        <div ref={containerRef}>
          <Timeline data={dataset} />
        </div>
      </Panel.Body>
    </Panel>
  );
}

export default Notification;

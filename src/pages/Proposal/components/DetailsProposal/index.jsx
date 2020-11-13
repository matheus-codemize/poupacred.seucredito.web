import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsBox from '../../../../redux/actions/box';
import actionsContainer from '../../../../redux/actions/container';

// utils
import language from '../../../../utils/language';

// services
import * as propostaApi from '../../../../services/proposta';

// assets
import backgroundImg from '../../../../assets/images/background/panel/proposta.jpg';

// components
import Box from '../../../../components/Box';
import Panel from '../../../../components/Panel';
import BoxData from '../../../../components/BoxData';
import ListEmpty from '../../../../components/ListEmpty';
import { convertKeys } from '../../../../components/BoxDataList';
import Button from '../../../../components/Button';

const languagePage = language['page.proposal'];

function DetailsProposal() {
  // resources hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const navigator = useSelector(state => state.navigator);

  // component state
  const [data, setData] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const proposal = _.get(location, 'state.proposal', null);
    setData(proposal);
  }, [location]);

  useEffect(() => {
    if (data && data.id) getProposal();
  }, [data]);

  async function getProposal() {
    dispatch(actionsContainer.loading());
    const response = await propostaApi.find(data.id);
    setDetails(response);
    dispatch(actionsContainer.close());
  }

  function handleOpenDocuments() {
    // dispatch(actionsBox.help(<img src={details.proposta.blocos[6].valor} />));
    // dispatch(actionsBox.open());
  }

  const detailsSectionHistory = useMemo(() => {
    return details && details.historico ? (
      <div className={styles.history}>
        <h1>
          {navigator.window.size.x >= 1280
            ? languagePage.labels.historyTitle
            : ''}
        </h1>
        <p>
          <a data-active={!!details.historico.length}>
            <label>
              <i
                className={
                  details.historico.length ? 'fas fa-history' : 'fa fa-close'
                }
              />
              {details.historico.length
                ? languagePage.labels.history
                : languagePage.labels.historyEmpty}
            </label>
          </a>
          <a data-active={!!details.contrato}>
            <label>
              <i className={details.contrato ? 'fas fa-file' : 'fa fa-close'} />
              {details.contrato
                ? languagePage.labels.contract
                : languagePage.labels.contractEmpty}
            </label>
          </a>
        </p>
        <ul>
          {details.historico.map((item, index) => (
            <li key={index}>
              <label>{item.nome}</label>
              <span>{item.data}</span>
            </li>
          ))}
        </ul>
        {details.historico.total > details.historico.length && (
          <h2>{languagePage.labels.hitoryLegend}</h2>
        )}
      </div>
    ) : (
      <></>
    );
  }, [details, navigator.window.size.x]);

  const renderDetails = useMemo(() => {
    const component = [];

    if (details) {
      if (details.cliente) {
        component.push(
          <BoxData
            title={languagePage.labels.client}
            useDirection={navigator.window.size.x < 1280}
            size={navigator.window.size.x < 1280 ? 'lg' : 'sm'}
            {...convertKeys(details.cliente)}
          />,
        );
      }

      if (details.proposta) {
        component.push(
          <BoxData
            title={details.proposta.nome}
            useDirection={navigator.window.size.x < 1280}
            size={navigator.window.size.x < 1280 ? 'lg' : 'sm'}
            {...convertKeys({
              ...details.proposta,
              blocos: details.proposta.blocos.filter(
                bloco => !bloco.valor.includes('data:image'),
              ),
            })}
            footer={
              <div className={styles.document}>
                <Button
                  onClick={handleOpenDocuments}
                  {...language['component.button.document']}
                />
                {navigator.window.size.x < 1280 && detailsSectionHistory}
              </div>
            }
          />,
        );
      }

      if (
        details.historico &&
        Array.isArray(details.historico) &&
        details.historico.length &&
        navigator.window.size.x >= 1280
      ) {
        component.push(
          <Box size={navigator.window.size.x < 1280 ? 'lg' : 'sm'}>
            {detailsSectionHistory}
          </Box>,
        );
      }
    }

    return <div className={styles.container}>{component}</div>;
  }, [details, navigator.window.size.x]);

  return (
    <Panel
      useDivider
      background={backgroundImg}
      title={languagePage.title}
      subtitle={languagePage.detailsTitle}
    >
      <Panel.Body>
        <ListEmpty visible={!data} />
        {renderDetails}
      </Panel.Body>
    </Panel>
  );
}

export default DetailsProposal;

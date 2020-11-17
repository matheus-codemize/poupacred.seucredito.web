import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
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
import Button from '../../../../components/Button';
import BoxData from '../../../../components/BoxData';
import InputFile from '../../../../components/InputFile';
import ListEmpty from '../../../../components/ListEmpty';
import { convertKeys } from '../../../../components/BoxDataList';

const languagePage = language['page.proposal'];

function DetailsProposal() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const navigator = useSelector(state => state.navigator);

  // component state
  const [data, setData] = useState(null);
  const [details, setDetails] = useState(null);
  const [indexDocument, setIndexDocument] = useState(-1);
  const [openDocument, setOpenDocument] = useState(false);

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

  async function handleDocument() {
    dispatch(actionsContainer.loading());
    const documentos = await propostaApi.getDocument(data.id);
    setDetails(prevDetails => ({ ...prevDetails, documentos }));
    handleOpenDocument();
    dispatch(actionsContainer.open({ onClose: handleOpenDocument }));
  }

  function handleOpenDocument(close = false) {
    setIndexDocument(-1);
    setOpenDocument(prevOpen => !prevOpen);

    if (close) {
      dispatch(actionsContainer.close());
    }
  }

  function handleViewDocument(index) {
    setIndexDocument(prevIndex => (prevIndex === index ? -1 : index));
  }

  async function handleChangeDocument(event) {
    const { id, value: file } = event.target;

    handleOpenDocument();
    dispatch(actionsContainer.loading());

    if (file) {
      const response = await propostaApi.updateDocument(data.id, {
        [id]: file.data,
      });
      if (response) handleDocument();
    }
  }

  const detailsSectionHistory = useMemo(() => {
    return details &&
      details.historico &&
      details.historico.dados &&
      Array.isArray(details.historico.dados) ? (
      <div className={styles.history} data-legend={details.historico.total > 1}>
        <h1>
          {navigator.window.size.x >= 1280
            ? languagePage.labels.historyTitle
            : ''}
        </h1>
        <p>
          <Link
            data-active={details.historico.total > 1}
            to={{
              state: { proposal: data },
              pathname: location.pathname + '/historico',
            }}
            onClick={event =>
              details.historico.total <= 1 && event.preventDefault()
            }
          >
            {details.historico.total > 1 && (
              <label>
                <i className="fas fa-history" />
                {languagePage.labels.history}
              </label>
            )}
          </Link>
          <Link
            target="_blank"
            to={details.contrato || '#'}
            data-active={!!details.contrato}
            onClick={event => !details.contrato && event.preventDefault()}
          >
            <label>
              <i className={details.contrato ? 'fas fa-file' : 'fa fa-close'} />
              {details.contrato
                ? languagePage.labels.contract
                : languagePage.labels.contractEmpty}
            </label>
          </Link>
        </p>
        <ul>
          {details.historico.dados.map((item, index) => (
            <li key={index}>
              <label>{item.nome}</label>
              <span>{item.data}</span>
            </li>
          ))}
        </ul>
        {details.historico.total > 1 && (
          <h2>{languagePage.labels.hitoryLegend}</h2>
        )}
      </div>
    ) : (
      <></>
    );
  }, [details, location.pathname, navigator.window.size.x]);

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
                  onClick={handleDocument}
                  {...language['component.button.document']}
                />
                {navigator.window.size.x < 1280 && detailsSectionHistory}
              </div>
            }
          />,
        );
      }

      if (navigator.window.size.x >= 1280) {
        component.push(
          <Box size={navigator.window.size.x < 1280 ? 'lg' : 'sm'}>
            {detailsSectionHistory}
          </Box>,
        );
      }
    }

    return (
      <div className={styles.container}>
        {component.map((component, key) =>
          React.cloneElement(component, { key }),
        )}
      </div>
    );
  }, [details, navigator.window.size.x]);

  return (
    <>
      <div data-open={openDocument} className={styles.modal}>
        <Box>
          <ul>
            {details &&
              details.documentos &&
              details.documentos.map((document, index) => (
                <li key={index} data-active={index === indexDocument}>
                  <label onClick={() => handleViewDocument(index)}>
                    {document.nome}
                    <i
                      className={`fas fa-caret-${
                        index === indexDocument ? 'up' : 'down'
                      }`}
                    />
                  </label>
                  <img src={document.valor} />
                  {data && data.status_id === 4 && (
                    <InputFile
                      id={document.id}
                      onChange={handleChangeDocument}
                    />
                  )}
                </li>
              ))}
          </ul>
          <Button
            data-unique
            type="link"
            onClick={() => handleOpenDocument(true)}
            {...language['component.button.close']}
          />
        </Box>
      </div>
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
    </>
  );
}

export default DetailsProposal;

import React, { useEffect, useMemo, useState } from 'react';
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
                (_bloco, index) => index <= 3,
              ),
            })}
            footer={
              <div className={styles.document}>
                <Button
                  onClick={handleOpenDocuments}
                  {...language['component.button.document']}
                />
                {navigator.window.size.x < 1280 && <></>}
              </div>
            }
          />,
        );

        if (navigator.window.size.x >= 1280) {
          component.push(
            <BoxData
              title={details.proposta.nome}
              useDirection={navigator.window.size.x < 1280}
              size={navigator.window.size.x < 1280 ? 'lg' : 'sm'}
              {...convertKeys({
                ...details.proposta,
                blocos: details.proposta.blocos.filter(
                  (_bloco, index) => index <= 3,
                ),
              })}
              footer={
                <div className={styles.document}>
                  <Button
                    onClick={handleOpenDocuments}
                    {...language['component.button.document']}
                  />
                </div>
              }
            />,
          );
        }
      }
    }

    return <div className={styles.container}>{component}</div>;
  }, [details, navigator.window.size.x]);

  return (
    <Panel background={backgroundImg} title={languagePage.detailsTitle}>
      <Panel.Body>
        <ListEmpty visible={!data} />
        {renderDetails}
      </Panel.Body>
    </Panel>
  );
}

export default DetailsProposal;

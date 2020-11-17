import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsContainer from '../../../../redux/actions/container';

// services
import * as crmApi from '../../../../services/crm';

// utils
import language from '../../../../utils/language';
import validator from '../../../../utils/validator';

// assets
import backgroundImg from '../../../../assets/images/background/panel/crm.jpg';

// components
import Box from '../../../../components/Box';
import Panel from '../../../../components/Panel';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import BoxData from '../../../../components/BoxData';
import ListEmpty from '../../../../components/ListEmpty';
import { convertKeys } from '../../../../components/BoxDataList';

const languagePage = language['page.crm'];

function MailingCrm() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(-1);

  useEffect(() => {
    getDetails();
  }, [location.state]);

  async function getDetails() {
    dispatch(actionsContainer.loading());

    const crm = _.get(location, 'state.crm', null);

    if (crm && crm.id) {
      const response = await crmApi.getAnswer(crm.id, crm.mailing.id);
      setDetails(response);
    }

    dispatch(actionsContainer.close());
  }

  function handleBack() {
    history.goBack();
  }

  function handleSchedule() {}

  function handleAnswer() {}

  async function handleAddContact() {
    dispatch(actionsContainer.loading());
    await crmApi.addPhone(details.id, phone);
    await getDetails();
    setPhone('');
    dispatch(actionsContainer.close());
  }

  async function handleContact(contact, action) {
    try {
      if (!contact) return;
      dispatch(actionsContainer.loading());

      let win;

      switch (action) {
        case 1: // open phone
          win = window.open(`tel:${contact.replace(/[^\d]/g, '')}`);
          if (win) return win.focus();
          break;

        case 2: // open whatsapp
          win = window.open(
            `https://api.whatsapp.com/send?phone=+55${contact.replace(
              /[^\d]/g,
              '',
            )}`,
            '_blank',
          );
          if (win) return win.focus();
          break;

        case 3: // like contact
        case 4: // dislike contact
          await crmApi.votePhone(contact.id, action === 3);
          await getDetails();
          break;

        default:
          break;
      }
    } catch (err) {
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handlePhone(event) {
    const { value } = event.target;
    setPhone(value);
  }

  const renderData = useMemo(() => {
    if (details && Array.isArray(details.dados)) {
      const { nome, dados } = details;
      return convertKeys({ nome, blocos: dados });
    }

    return null;
  }, [details]);

  const renderProposal = useMemo(() => {
    const data = { title: languagePage.labels.proposal };

    if (details && Array.isArray(details.proposta) && details.proposta.length) {
      data.blocos = details.proposta;
    } else {
      data.footer = (
        <h2 className={styles.empty}>{languagePage.labels.proposalEmpty}</h2>
      );
    }

    return convertKeys(data);
  }, [details]);

  return (
    <Panel
      onBack={handleBack}
      background={backgroundImg}
      title={languagePage.title}
      subtitle={languagePage.mailingTitle}
      actions={[
        {
          onClick: handleSchedule,
          icon: 'fas fa-calendar-day',
          text: languagePage.labels.schedule,
        },
        {
          icon: 'fas fa-check',
          onClick: handleAnswer,
          text: languagePage.labels.answer,
        },
      ]}
    >
      <Panel.Body>
        <ListEmpty visible={!details} />
        {details && (
          <div className={styles.container}>
            <BoxData {...renderData} />
            <Box>
              <div className={styles.contact}>
                <h1>{languagePage.labels.contact}</h1>
                <Input
                  id="phone"
                  type="phone"
                  value={phone || ''}
                  onChange={handlePhone}
                  action={{
                    icon: 'fas fa-plus',
                    onClick: handleAddContact,
                    disabled: phone.length < 14,
                  }}
                />
                {details &&
                Array.isArray(details.contato) &&
                details.contato.length ? (
                  <ul>
                    {details.contato.map((contato, index) => (
                      <li key={index}>
                        {contato.numero}
                        {dropdownIndex === index && (
                          <div className={styles.dropdown}>
                            {languagePage.contactActions
                              .filter(
                                action => !contato.votado || action.key <= 2,
                              )
                              .map((action, index) => (
                                <label
                                  key={index}
                                  onMouseDown={() =>
                                    handleContact(contato, action.key)
                                  }
                                >
                                  <i
                                    className={action.icon}
                                    style={{ color: action.color }}
                                  />
                                  {action.text}
                                </label>
                              ))}
                          </div>
                        )}
                        <Button
                          type="link"
                          tabIndex="-1"
                          icon="fas fa-caret-down"
                          onBlur={() => setDropdownIndex(-1)}
                          data-active={index === dropdownIndex}
                          onClick={() =>
                            setDropdownIndex(prevIndex =>
                              prevIndex === index ? -1 : index,
                            )
                          }
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <h2 className={styles.empty}>
                    {languagePage.labels.contactEmpty}
                  </h2>
                )}
              </div>
            </Box>
            <BoxData {...renderProposal} />
          </div>
        )}
      </Panel.Body>
    </Panel>
  );
}

export default MailingCrm;

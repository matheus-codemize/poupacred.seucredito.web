import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsContainer from '../../../../redux/actions/container';

// services
import * as crmApi from '../../../../services/crm';

// utils
import moment from '../../../../utils/moment';
import language from '../../../../utils/language';

// assets
import backgroundImg from '../../../../assets/images/background/panel/crm.jpg';

// components
import Box from '../../../../components/Box';
import Panel from '../../../../components/Panel';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import BoxData from '../../../../components/BoxData';
import Textarea from '../../../../components/Textarea';
import ListEmpty from '../../../../components/ListEmpty';
import InputDate from '../../../../components/InputDate';
import { convertKeys } from '../../../../components/BoxDataList';
import toast from '../../../../utils/toast';

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

const buttons = {
  answer: {
    icon: 'fas fa-calendar-day',
    text: languagePage.labels.schedule,
  },
  schedule: {
    icon: 'fas fa-check',
    text: languagePage.labels.answer,
  },
};

function MailingCrm() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const container = useSelector(state => state.container);

  // component state
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState(null);
  const [register, setRegister] = useState({});
  const [typeModal, setTypeModal] = useState(0);
  const [tabulacaos, setTabulacaos] = useState([]);
  const [dropdownIndex, setDropdownIndex] = useState(-1);

  useEffect(() => {
    getTabulacaos();
  }, []);

  useEffect(() => {
    getDetails();
  }, [location.state]);

  async function getDetails() {
    dispatch(actionsContainer.loading());

    const crm = _.get(location, 'state.crm', null);

    if (crm && crm.id) {
      const response = await crmApi.getAnswer(crm.id, crm.mailing.id);
      setDetails(response);
      setRegister({ solicitacao: crm.id, cliente: crm.mailing.id });
    }

    dispatch(actionsContainer.close());
  }

  async function getTabulacaos() {
    const response = await crmApi.getTabulacaos();
    setTabulacaos(response);
  }

  function handleBack() {
    history.goBack();
  }

  async function handleMailing(type = 0) {
    setTypeModal(type);
    dispatch(
      type
        ? actionsContainer.open({ onClose: handleMailing })
        : actionsContainer.close(),
    );
    if (!type) {
      setRegister(prevRegister => ({
        cliente: prevRegister.cliente,
        solicitacao: prevRegister.solicitacao,
      }));
    }
  }

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

  function handleChange(event) {
    const { id, value } = event.target;
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  async function saveMailing() {
    dispatch(actionsContainer.loading());
    await (typeModal === 1
      ? crmApi.schedule({
          ...register,
          data: moment(register.data).format('DD/MM/YYYY'),
        })
      : crmApi.answer(register));
    toast.success(
      languagePage[typeModal === 1 ? 'successAnswer' : 'successSchedule'],
    );
    handleMailing();
    dispatch(actionsContainer.close());
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

  const disabledBtnModal = useMemo(() => {
    return (
      (typeModal === 1 && !register.data) ||
      (typeModal === 2 && !register.tabulacao)
    );
  }, [register, typeModal]);

  return (
    <>
      <div
        className={styles.modal}
        data-visible={!!typeModal && !container.loading}
      >
        <h1>
          {
            languagePage.labels[
              typeModal === 1 ? 'scheduleModal' : 'answerModal'
            ]
          }
        </h1>
        <i className="fas fa-times" onClick={() => handleMailing()} />
        {typeModal === 1 ? (
          <InputDate
            id="data"
            data-unique
            onChange={handleChange}
            value={register.data || ''}
            label={languagePage.labels.date}
            dateMin={moment().add('days', 1)}
          />
        ) : (
          <Select
            data-unique
            id="tabulacao"
            options={tabulacaos}
            onChange={handleChange}
            value={register.tabulacao || ''}
            {...languageForm.tabulacao}
          />
        )}
        <Textarea
          data-unique
          id="observacao"
          onChange={handleChange}
          value={register.observacao || ''}
          {...languageForm.observacao}
        />
        <Button
          onClick={saveMailing}
          disabled={disabledBtnModal}
          {...buttons[typeModal === 1 ? 'answer' : 'schedule']}
        />
      </div>
      <Panel
        onBack={handleBack}
        background={backgroundImg}
        title={languagePage.title}
        subtitle={languagePage.mailingTitle}
        actions={
          details && [
            {
              ...buttons.answer,
              onClick: () => handleMailing(1),
            },
            {
              ...buttons.schedule,
              onClick: () => handleMailing(2),
            },
          ]
        }
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
    </>
  );
}

export default MailingCrm;

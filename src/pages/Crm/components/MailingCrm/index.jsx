import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsContainer from '../../../../redux/actions/container';

// utils
import language from '../../../../utils/language';

// assets
import backgroundImg from '../../../../assets/images/background/panel/crm.jpg';

// components
import Box from '../../../../components/Box';
import Panel from '../../../../components/Panel';
import BoxData from '../../../../components/BoxData';
import ListEmpty from '../../../../components/ListEmpty';
import { convertKeys } from '../../../../components/BoxDataList';
import Button from '../../../../components/Button';

const languagePage = language['page.crm'];

function MailingCrm() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // component state
  const [details, setDetails] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(-1);

  useEffect(() => {
    const mailing = _.get(location, 'state.crm', null);
    setDetails(mailing);
  }, [location.state]);

  function handleBack() {
    history.goBack();
  }

  function handleSchedule() {}

  function handleAnswer() {}

  function handleAddContact() {}

  function handleDropdown(index, event) {
    event.stopPropagation();
    const element = document.getElementsByClassName(styles.dropdown)[index];

    if (element.className.includes(styles.dropdown_open)) {
      element.classList.remove(styles.dropdown_open);
    } else {
      element.classList.add(styles.dropdown_open);
    }
  }

  function handleContact(contact, action) {
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
          break;

        case 4: // dislike contact
          break;

        default:
          break;
      }
    } catch (err) {
    } finally {
      dispatch(actionsContainer.close());
    }
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
        <div className={styles.container}>
          <BoxData {...renderData} />
          <Box>
            <div className={styles.contact}>
              <h1>
                {languagePage.labels.contact}
                <Button
                  type="link"
                  onClick={handleAddContact}
                  {...language['component.button.add']}
                />
              </h1>
              {details &&
              Array.isArray(details.contato) &&
              details.contato.concat(['(18) 99819-1947']).length ? (
                <ul>
                  {details.contato
                    .concat(['(18) 99819-1947', '(18) 99819-1947'])
                    .map((contato, index) => (
                      <li key={index}>
                        {contato}
                        {dropdownIndex === index && (
                          <div className={styles.dropdown}>
                            {languagePage.contactActions.map(
                              (action, index) => (
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
                              ),
                            )}
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
      </Panel.Body>
    </Panel>
  );
}

export default MailingCrm;

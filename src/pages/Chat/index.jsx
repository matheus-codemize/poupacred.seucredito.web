import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// services
import * as chatApi from '../../services/chat';

// utils
import language from '../../utils/language';

// redux
import actionsContainer from '../../redux/actions/container';

// components
import Carousel from '../../components/Carousel';

const languageComp = language['component.chat'];

function Chat() {
  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const container = useSelector(state => state.container);

  // component state
  const [rows, setRows] = useState(1);
  const [step, setStep] = useState(0);
  const [type, setType] = useState(-1);
  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    dispatch(
      actionsContainer[open ? 'open' : 'close']({ onClose: handleOpen }),
    );

    if (open) {
      initComponent();
    }
  }, [open]);

  async function initComponent() {
    handleLoading();
    await getTypes();
    handleLoading();

    // default state
    setStep(0);
    setType(-1);
    setConversation(null);
  }

  async function getTypes() {
    const response = await chatApi.getTypes();
    setTypes(response);
  }

  async function getConversations() {
    const response = await chatApi.list();
    // setConversations(response);
    setConversations([
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem:
          'Olá, preciso de ajuda! - Olá, preciso de ajuda! - Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
      {
        id: 2,
        data: '19 minutos atrás',
        total: 1,
        status: 'Aguardando Atendimento',
        atendente: null,
        status_id: 1,
        ultima_mensagem: 'Olá, preciso de ajuda!',
      },
    ]);
  }

  function handleLoading() {
    setLoading(prevLoading => !prevLoading);
  }

  function handleOpen() {
    if (!container.loading) {
      setOpen(prevOpen => !prevOpen);
    }
  }

  async function handleStep() {
    handleLoading();
    await (step ? getTypes() : getConversations());
    setStep(prevStep => (prevStep ? 0 : 1));
    handleLoading();
  }

  function handleMessage(event) {
    const { value } = event.target;
    setMessage(value);
    setRows(Math.min(3, (value.match(/\n/g) || '').length + 1));
  }

  async function sendMessage() {}

  return (
    <>
      <div
        onClick={handleOpen}
        className={styles.container}
        data-block={container.loading}
      >
        <i className="fas fa-comments" />
      </div>
      <div className={styles.chat} data-open={open}>
        <div className={styles.header}>
          <h1 onClick={handleStep}>
            {!!step && <i className={`fas fa-angle-left ${styles.left}`} />}
            {languageComp.labels[step ? 'prev' : 'next']}
            {!step && <i className={`fas fa-angle-right ${styles.right}`} />}
          </h1>
          <i className="fa fa-times" onClick={handleOpen} />
        </div>
        <div data-loading={loading} className={styles.body}>
          <div data-open={loading} className={styles.loading}>
            <i className="fas fa-spinner fa-spin" />
          </div>
          <Carousel step={step}>
            <Carousel.Step>
              <p
                data-type="helcome"
                className={styles.message}
                dangerouslySetInnerHTML={{ __html: languageComp.helcome }}
              />
              {types.length > 0 && (
                <ul className={styles.type}>
                  {types.map((item, index) => (
                    <li
                      key={index}
                      data-active={index === type}
                      onClick={() => setType(index)}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </Carousel.Step>
            <Carousel.Step>
              <ul className={styles.conversation}>
                {conversations.map((item, index) => (
                  <li key={index}>
                    <h1>
                      {item.data}
                      <span>{item.data}</span>
                    </h1>
                    <div>{item.ultima_mensagem}</div>
                  </li>
                ))}
              </ul>
            </Carousel.Step>
          </Carousel>
        </div>
        <div className={styles.footer}>
          {((!step || conversation) && (
            <>
              <textarea
                rows={rows}
                data-unique
                id="message"
                onChange={handleMessage}
                placeholder={languageComp.labels.placeholder}
              >
                {message}
              </textarea>
              <i onClick={sendMessage} className="fas fa-paper-plane" />
            </>
          )) || (
            <h2>
              {languageComp.labels.length.replace(
                '[length]',
                conversations.length,
              )}
            </h2>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;

import React, { useRef, useState, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// socketio
import socket from '../../socketio';

// services
import * as chatApi from '../../services/chat';

// assets
import logo from '../../assets/images/logo.png';

// utils
import language from '../../utils/language';

// redux
import actionsContainer from '../../redux/actions/container';

// components
import Carousel from '../../components/Carousel';

const languageComp = language['component.chat'];

function Chat() {
  // references
  const body = useRef(null);
  const bodyError = useRef(null);

  // resources hooks
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);
  const container = useSelector(state => state.container);

  // component state
  const [news, setNews] = useState(0);
  const [rows, setRows] = useState(1);
  const [step, setStep] = useState(0);
  const [type, setType] = useState(0);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, total: 0 });

  useEffect(() => {
    if (open && body.current && bodyError.current) {
      bodyError.current.style.width = `calc(${body.current.offsetWidth}px - 4rem)`;
    }
  }, [open, body.current, bodyError.current]);

  useEffect(() => {
    dispatch(
      actionsContainer[open ? 'open' : 'close']({ onClose: handleOpen }),
    );

    if (!open) {
      initComponent();
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, [3000]);
    }
  }, [error]);

  useEffect(() => {
    socket.on(`chat_${auth.uid}`, addMessage);
  }, [auth.uid]);

  function addMessage(data) {
    console.log(data);
  }

  async function initComponent() {
    handleLoading();
    await getTypes();
    handleLoading();

    // default state
    setStep(0);
    setType(0);
    setMessage('');
    setConversation(null);
  }

  async function getTypes() {
    const response = await chatApi.getTypes();
    setTypes(response);
  }

  async function getConversations() {
    const response = await chatApi.list();
    setConversation(null);
    setConversations(response);
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
    switch (step) {
      case 0:
        await getConversations();
        setStep(1);
        break;

      case 1:
        await (conversation ? getTypes() : getTypes());
        setStep(conversation ? 2 : 0);
        break;

      case 2:
        await getConversations();
        setStep(1);
        setConversation(null);
        setPagination({ current: 1, total: 0 });
        break;
    }
    handleLoading();
  }

  function handleMessage(event) {
    const { value } = event.target;
    setMessage(value);
    setRows(Math.min(3, (value.match(/\n/g) || '').length + 1));
  }

  async function handleConversation(item = null) {
    handleLoading();
    const response = await chatApi.getConversation(item.id, pagination.current);

    setStep(2);
    setConversation(item);
    setMessages(response.dados.reverse());
    setPagination(prevPagination => ({
      total: response.total,
      current: prevPagination.current + 1,
    }));

    handleLoading();
  }

  async function sendMessage() {
    try {
      handleLoading();

      if (error) {
        return;
      }

      switch (step) {
        case 0:
          if (!type || !message) {
            return setError(languageComp.errors[!type ? 'type' : 'message']);
          }
          await chatApi.register(type, message);
          setType(0);
          break;

        case 2:
          if (!message) return;
          await chatApi.sendMessage(conversation.id, message);
          break;

        default:
          break;
      }

      setMessage('');
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      setError(message);
    } finally {
      handleLoading();
    }
  }

  return (
    <>
      <div className={styles.icon} data-block={container.loading}>
        <i onClick={handleOpen} className="fas fa-comments" />
      </div>
      <div className={styles.chat} data-open={open}>
        <div className={styles.header}>
          <h1 onClick={handleStep}>
            {!!step && <i className={`fas fa-angle-left ${styles.left}`} />}
            {conversation
              ? conversation.atendente || conversation.status
              : languageComp.labels[`step${step}`]}
            {!step && <i className={`fas fa-angle-right ${styles.right}`} />}
          </h1>
          <i className="fa fa-times" onClick={handleOpen} />
        </div>
        <div ref={body} data-loading={loading} className={styles.body}>
          <div
            ref={bodyError}
            data-visible={!!error}
            className={styles.error}
            dangerouslySetInnerHTML={{ __html: error }}
          />
          <div data-open={loading} className={styles.loading}>
            <i className="fas fa-spinner fa-spin" />
          </div>
          <Carousel step={step}>
            <Carousel.Step>
              <img src={logo} alt="logo" />
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
                      data-active={item.value === type}
                      onClick={() => setType(item.value)}
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
                  <li key={index} onClick={() => handleConversation(item)}>
                    <h1>
                      {item.atendente || item.status || '<Vazio>'}
                      <span>{item.data}</span>
                    </h1>
                    <div>{item.ultima_mensagem}</div>
                  </li>
                ))}
              </ul>
            </Carousel.Step>
            <Carousel.Step>
              <ul>
                {messages.map((item, index) => (
                  <li key={index}>
                    <p
                      className={styles.message}
                      dangerouslySetInnerHTML={{ __html: item.msg }}
                      data-type={
                        item.autor_id === auth.uid ? 'send' : 'received'
                      }
                    />
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
                rows="1"
                // rows={rows}
                data-unique
                id="message"
                value={message}
                onChange={handleMessage}
                placeholder={languageComp.labels.placeholder}
              />
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

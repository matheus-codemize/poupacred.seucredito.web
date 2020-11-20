import React, { useRef, useState, useEffect } from 'react';
import $ from 'jquery';
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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketIds, setSocketIds] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, total: 0 });

  /**
   * Effect para abri a conversa com o scroll no final
   */
  useEffect(() => {
    if (step === 2 && body.current) {
      const element = $(body.current);
      element.scrollTop(element.prop('scrollHeight'));
    }
  }, [step, body.current]);

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
    if (
      conversation &&
      conversation.id &&
      !socketIds.includes(conversation.id)
    ) {
      setSocketIds(prevSocket => prevSocket.concat([conversation.id]));
      socket.on(`chat_${conversation.id}`, data =>
        addMessage(data, conversation.id),
      );
    }
  }, [conversation, socketIds]);

  function addMessage(data, conversationId) {
    if (conversationId && data && conversation.id === conversationId) {
      setMessages(prevMessages => prevMessages.concat([data]));
    }
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
    setPagination({ current: 1, total: 0 });
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

    if (item) {
      const response = await chatApi.getConversation(
        item.id,
        pagination.current,
      );
      setMessages(response.dados);
      setPagination(prevPagination => ({
        total: response.total,
        current: prevPagination.current + 1,
      }));
    }

    setStep(2);
    setConversation(item);

    handleLoading();
  }

  async function sendMessage() {
    try {
      let response;
      handleLoading();

      if (error) {
        return;
      }

      switch (step) {
        case 0:
          if (!type || !message) {
            return setError(languageComp.errors[!type ? 'type' : 'message']);
          }
          response = await chatApi.register(type, message);
          if (response) {
            setType(0);
            handleConversation({ id: response.chat, ...response });
          }
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
      <div
        className={styles.icon}
        data-loading={container.loading}
        data-hide={!open && container.open}
      >
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
              <section className={styles.section_message}>
                <ul>
                  {messages.map((item, index) => (
                    <li key={index}>
                      <p
                        className={styles.message}
                        dangerouslySetInnerHTML={{
                          __html: item.msg.replace(/(?:\r\n|\r|\n)/g, '<br />'),
                        }}
                        data-type={
                          item.autor_id === auth.uid ? 'send' : 'received'
                        }
                      />
                      <span>{item.data}</span>
                    </li>
                  ))}
                </ul>
              </section>
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

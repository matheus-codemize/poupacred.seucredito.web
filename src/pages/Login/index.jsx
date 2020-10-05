import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/auth';

// utils
import hash from '../../utils/hash';
import toast from '../../utils/toast';
import format from '../../utils/format';
import language, { errors as errorsLanguage } from '../../utils/language';

// services
import api from '../../services/api';

// resources
import registerDefault from '../../resources/data/register/user';

// component
import Box from '../../components/Box';
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Button from '../../components/Button';

function Login() {
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);

  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState({ ...registerDefault });

  // state para o 1º acesso
  const [senha, setSenha] = useState('');
  const [confirma_senha, setConfirmaSenha] = useState('');

  useEffect(() => {
    const { state } = location;

    if (state) {
      if (state.type && ['agent', 'client'].includes(state.type)) {
        setType(state.type);
      }

      if (state.login) {
        setRegister(prevRegister => ({ ...prevRegister, login: state.login }));
      }
    }
  }, [location, location.state]);

  async function handleLogin(event) {
    try {
      event.preventDefault();
      handleLoading('on');

      const url = `/${type}es/login`;
      const request = await api.post(url, register);
      return dispatch(
        actions.signIn({
          ...request,
          type: type,
          login: register.login,
          senha: hash.encrypt(register.senha),
        }),
      );
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      setError(message);
      setRegister(prevRegister => ({ ...prevRegister, senha: '' }));
    } finally {
      handleLoading();
    }
  }

  async function handleFirsAccess(event) {
    try {
      event.preventDefault();

      if (senha !== confirma_senha) {
        return setError(errorsLanguage.password);
      }

      handleLoading('on');

      const url = `/agentes/primeiro-acesso`;
      const data = { senhaAtual: hash.decrypt(auth.senha), novaSenha: senha };
      await api.post(url, data);
      return dispatch(actions.first(false));
    } catch (err) {
      const error = _.get(err, 'response.data', err.message);

      if (typeof error === 'string') {
        return toast.error(error);
      }

      switch (error.codigo) {
        case 29: // Agente já realizou o primeiro acesso
          toast.info(error.erro);
          return dispatch(actions.first(false));

        default:
          setError(error.erro);
          break;
      }
    } finally {
      handleLoading();
    }
  }

  function handleLoading(type = 'off') {
    setLoading(prevLoading => {
      if (type === 'on' && !prevLoading) return true;
      if (type === 'off' && prevLoading) return false;
      return prevLoading;
    });
  }

  function handleChange(event) {
    let { id, value } = event.target;

    switch (id) {
      case 'login':
        value = format.cpf(value, register.login);
        break;

      default:
        break;
    }

    setError('');
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  function handleSenha(event) {
    const { id, value } = event.target;

    setError('');
    if (id === 'senha') {
      setSenha(value);
    } else {
      setConfirmaSenha(value);
    }
  }

  return (
    <div>
      <Panel
        title={
          auth.primeiro_acesso
            ? language['login.first.title'].replace(
                '[name]',
                `<span style="font-style: italic;">${auth.nome || ''}</span>`,
              )
            : language['login.title']
        }
      >
        <Panel.Body>
          <div className={styles.container}>
            <div className={styles.form}>
              <Box
                onBack={
                  !auth.primeiro_acesso && type ? () => setType('') : false
                }
              >
                {auth.primeiro_acesso ? (
                  <form onSubmit={handleFirsAccess}>
                    <div className={styles.container_login}>
                      <h1>{language['login.first.subtitle']}</h1>
                      <Input
                        id="senha"
                        value={senha}
                        htmlType="password"
                        onChange={handleSenha}
                        help={language['login.first.input'].senha.help}
                        placeholder={
                          language['login.first.input'].senha.placeholder
                        }
                      />
                      <Input
                        help={error}
                        helpType="error"
                        id="confirma_senha"
                        htmlType="password"
                        value={confirma_senha}
                        onChange={handleSenha}
                        placeholder={
                          language['login.first.input'].confirma_senha
                            .placeholder
                        }
                      />
                      <Button
                        light
                        loading={loading}
                        htmlType="submit"
                        icon="fa fa-sign-in"
                        disabled={!senha || !confirma_senha || !!error}
                      >
                        {language['login.first.input'].btn_sigin.text}
                      </Button>
                    </div>
                  </form>
                ) : type ? (
                  <form onSubmit={handleLogin}>
                    <div className={styles.container_login}>
                      <Input
                        id="login"
                        disabled={loading}
                        onChange={handleChange}
                        value={register.login || ''}
                        {...language['login.input'].login}
                      />
                      <Input
                        id="senha"
                        help={error}
                        helpType="error"
                        disabled={loading}
                        htmlType="password"
                        onChange={handleChange}
                        value={register.senha || ''}
                        {...language['login.input'].senha}
                      />
                      <Button
                        light
                        loading={loading}
                        htmlType="submit"
                        icon="fa fa-sign-in"
                        disabled={!register.login || !register.senha}
                      >
                        {language['login.input'].btn_sigin.text}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.container_type}>
                    <h1>{language['login.enterby'].title}</h1>
                    <Button icon="fa fa-user" onClick={() => setType('client')}>
                      {language['login.enterby'].client}
                    </Button>
                    <Button
                      type="secondary"
                      icon="fa fa-user-tie"
                      onClick={() => setType('agent')}
                    >
                      {language['login.enterby'].agent}
                    </Button>
                  </div>
                )}
              </Box>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default Login;

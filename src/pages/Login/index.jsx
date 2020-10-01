import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/auth';

// utils
import format from '../../utils/format';
import language from '../../utils/language';

// services
import api from '../../services/api';

// resources
import dataDefault, { convertKeys } from '../../resources/data/user/register';

// component
import Box from '../../components/Box';
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Button from '../../components/Button';

function Login() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);

  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ ...dataDefault });

  useEffect(() => {
    const { state = {} } = location;

    if (state.type && ['agent', 'client'].indexOf(state.type)) {
      setType(state.type);
    }

    if (state.login) {
      setData(prevData => ({ ...prevData, login: state.login }));
    }
  }, [location.state]);

  useEffect(() => {
    if (auth.token) {
      dispatch(actions.logout());
    }
  }, [auth]);

  async function handleLogin(event) {
    try {
      event.preventDefault();
      setLoading(true);

      const url = `/${type}es/login`;
      const request = convertKeys(data);
      const { uid, nome, token } = await api.post(url, request);
      const response = { ...data, name: nome, uid, token, type };
      history.push('/home');
      setLoading(false);
      dispatch(actions.signIn(response));
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      setLoading(false);
      setError(message);
      setData(prevData => ({ ...prevData, password: '' }));
    }
  }

  function handleChange(event) {
    const { id, value } = event.target;

    setError('');
    setData(prevData => ({
      ...prevData,
      [id]: id === 'login' ? format.cpf(value, data.login) : value,
    }));
  }

  return (
    <div>
      <Panel title={language['login.title']} />
      <div className={styles.container}>
        <div className={styles.form}>
          <Box onBack={type ? () => setType('') : false}>
            {type ? (
              <form onSubmit={handleLogin}>
                <div className={styles.container_login}>
                  <Input
                    id="login"
                    disabled={loading}
                    onChange={handleChange}
                    value={data.login || ''}
                    placeholder="000.000.000-00"
                    label={language['login.form']['login.label']}
                  />
                  <Input
                    help={error}
                    id="password"
                    disabled={loading}
                    htmlType="password"
                    onChange={handleChange}
                    value={data.password || ''}
                    label={language['login.form']['password.label']}
                  />
                  {/* <Button
                    type="link"
                    disabled={loading}
                    onClick={handleForgotPassword}
                  >
                    {language['login.form']['button.forgot']}
                  </Button> */}
                  <Button
                    light
                    loading={loading}
                    htmlType="submit"
                    icon="fa fa-sign-in"
                    disabled={!data.login || !data.password}
                  >
                    {language['login.form']['button.sigin']}
                  </Button>
                </div>
              </form>
            ) : (
              <div className={styles.container_type}>
                <h1>{language['login.enterby']['title']}</h1>
                <Button icon="fa fa-user" onClick={() => setType('client')}>
                  {language['login.enterby']['client']}
                </Button>
                <Button
                  type="secondary"
                  icon="fa fa-user-tie"
                  onClick={() => setType('agent')}
                >
                  {language['login.enterby']['agent']}
                </Button>
              </div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Login;

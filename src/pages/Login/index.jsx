import React, { useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actions from '../../redux/actions/auth';
import actionsContainer from '../../redux/actions/container';

// assets
import logo from '../../assets/images/logo.png';
import bannerDesktop from '../../assets/images/login-bg.jpg';
import bannerMobile from '../../assets/images/login-bg-mobile.jpg';

// utils
import hash from '../../utils/hash';
import toast from '../../utils/toast';
import language, { errors as languageErrors } from '../../utils/language';

// services
import api from '../../services/api';

// resources
import registerDefault from '../../resources/data/register/user';

// components
import Box from '../../components/Box';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';

const languagePage = language['page.login'];
const languageForm = language['component.form.props'];

function Login() {
  // references
  const formRef = useRef(null);
  const bannerRef = useRef(null);

  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);
  const navigator = useSelector(state => state.navigator);
  const simulation = useSelector(state => state.simulation);

  // component style
  const [step, setStep] = useState(0);
  const [type, setType] = useState('');
  const [error, setError] = useState({});
  const [register, setRegister] = useState({ ...registerDefault });

  useEffect(() => {
    if (formRef.current && bannerRef.current) {
      bannerRef.current.style.top = `${formRef.current.offsetTop}px`;
    }
  });

  useEffect(() => {
    setType(prevType => (step ? prevType : ''));
  }, [step]);

  useEffect(() => {
    const typeParam = _.get(location, 'state.login.type', '');
    const registerParam = _.get(location, 'state.login.register', null);

    handleChooseType(typeParam);
    setRegister(prevRegister => ({ ...prevRegister, ...registerParam }));
  }, [location.state]);

  useEffect(() => {
    if (step < 2 && auth.primeiro_acesso) {
      setStep(2);
    }
  }, [step, auth.primeiro_acesso]);

  function handleBack() {
    if (!step) {
      return history.replace(simulation.off ? '/simulacao/propostas' : '/');
    }
    setStep(prevStep => prevStep - 1);
  }

  function handleNext() {
    setStep(prevStep => prevStep + 1);
  }

  function handleChooseType(typeSelected) {
    if (typeSelected) {
      handleNext();
      setType(typeSelected);
    }
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();

      const data = {};

      if (auth.primeiro_acesso) {
        if (register.novaSenha.length < 6) {
          return setError(prevError => ({
            ...prevError,
            novaSenha: languageErrors.length
              .replace('[field]', languageForm.novaSenha.label)
              .replace('[length]', '6'),
          }));
        }

        if (register.novaSenha !== register.confirmaSenha) {
          return setError(prevError => ({
            ...prevError,
            confirmaSenha: languageErrors.password,
          }));
        }

        data.senhaAtual = hash.decrypt(auth.senha);
        data.novaSenha = register.novaSenha;
      } else {
        // if (register.senha.length < 6) {
        //   return setError(prevError => ({
        //     ...prevError,
        //     senha: languageErrors.length
        //       .replace('[field]', languageForm.senha.label)
        //       .replace('[length]', '6'),
        //   }));
        // }

        data.login = register.login;
        data.senha = register.senha;
      }

      dispatch(actionsContainer.loading());
      const url = auth.primeiro_acesso
        ? '/agentes/primeiro-acesso'
        : `/${type}es/login`;
      const request = await api.post(url, data);

      if (auth.primeiro_acesso) {
        dispatch(actions.first());
      } else {
        dispatch(
          actions.signIn({
            ...request,
            type,
            login: register.login,
            senha: hash.encrypt(register.senha),
          }),
        );
      }
    } catch (err) {
      const responseErro = _.get(err, 'response.data', err.message);

      if (
        typeof responseErro === 'string' ||
        (typeof responseErro === 'object' && responseErro.codigo !== 29)
      ) {
        return setError(prevError => ({
          ...prevError,
          [auth.primeiro_acesso ? 'confirmaSenha' : 'senha']:
            typeof responseErro === 'string' ? responseErro : responseErro.erro,
        }));
      }

      /**
       * Erro 29 - Agente já realizou o primeiro acesso
       * É o único erro mapeado pois só se conhece tal erro
       */
      toast.info(responseErro.erro);
      dispatch(actions.first());
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handleChange(event) {
    const { id, value } = event.target;
    setError(prevError => ({ ...prevError, [id]: '' }));
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  function handleLogout() {
    setStep(0);
    setRegister({ ...registerDefault });
    dispatch(actions.logout());
  }

  function handleRegister() {
    history.push(`/cadastro/${type}e`);
  }

  const disabledBtnLogin = useMemo(() => {
    return (
      Object.keys(error).filter(key => error[key]).length > 0 ||
      (step <= 1
        ? !register.login || !register.senha
        : !register.novaSenha || !register.confirmaSenha)
    );
  }, [step, error, register]);

  const renderBanner = useMemo(() => {
    return (
      <div
        ref={bannerRef}
        className={styles.banner}
        style={{
          backgroundImage: `url(${
            navigator.type === 'mobile' ? bannerMobile : bannerDesktop
          })`,
        }}
      />
    );
  }, [navigator.type]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logo} onClick={() => history.push('/')} />
        {auth.primeiro_acesso && (
          <label className={styles.logout} onClick={handleLogout}>
            <i className={language['component.button.logout'].icon} />
            {language['component.button.logout'].text}
          </label>
        )}
      </div>
      <h1 className={styles.title}>
        {step <= 1 ? (
          languagePage.title
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: languagePage.titleFirst.replace(
                '[name]',
                `<span style="font-style: italic;">${
                  (auth.nome && auth.nome.split(' ')[0]) || ''
                }</span>`,
              ),
            }}
          />
        )}
      </h1>
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
        <Box
          size="sm"
          // help={step === 1 ? renderHelp : ''}
          onBack={auth.primeiro_acesso && step === 2 ? undefined : handleBack}
        >
          <Carousel step={step}>
            <Carousel.Step>
              <h1>{languagePage.titleType}</h1>
              <div className={styles.form_type}>
                {languagePage.types.map((item, index) => (
                  <div key={index} onClick={() => handleChooseType(item.value)}>
                    <i className={item.icon} />
                    <label>{item.label}</label>
                  </div>
                ))}
              </div>
            </Carousel.Step>
            <Carousel.Step>
              <Input
                id="login"
                type="cpf"
                helpType="error"
                onChange={handleChange}
                help={error.login || ''}
                value={register.login || ''}
                {...languageForm.cpf}
              />
              <Input
                id="senha"
                helpType="error"
                htmlType="password"
                onChange={handleChange}
                help={error.senha || ''}
                value={register.senha || ''}
                {...languageForm.senha}
              />
            </Carousel.Step>
            <Carousel.Step>
              <h1>{languagePage.subtitleFirst}</h1>
              <Input
                id="novaSenha"
                helpType="error"
                htmlType="password"
                onChange={handleChange}
                help={error.novaSenha || ''}
                value={register.novaSenha || ''}
                placeholder={languageForm.novaSenha.placeholder}
              />
              <Input
                helpType="error"
                id="confirmaSenha"
                htmlType="password"
                onChange={handleChange}
                help={error.confirmaSenha || ''}
                value={register.confirmaSenha || ''}
                placeholder={languageForm.confirmaSenha.placeholder}
              />
            </Carousel.Step>
          </Carousel>
          {step > 0 && (
            <>
              <Button
                light
                data-unique
                htmlType="submit"
                disabled={disabledBtnLogin}
                {...language[
                  `component.button.${step <= 1 ? 'login' : 'register'}`
                ]}
              />
              <Button type="link" onClick={handleRegister}>
                {languagePage.register}
              </Button>
            </>
          )}
        </Box>
      </form>
      {renderBanner}
    </div>
  );
}

export default Login;

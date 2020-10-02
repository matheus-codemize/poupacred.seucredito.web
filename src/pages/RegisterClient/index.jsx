import React, { useMemo, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actionsAuth from '../../redux/actions/auth';

// resources
import inputsize from '../../resources/data/inputsize/client';
import registerDefault from '../../resources/data/register/client';

// services
import api from '../../services/api';

// utils
import toast from '../../utils/toast';
import moment from '../../utils/moment';
import format from '../../utils/format';
import getColSize from '../../utils/getColSize';
import cpfValidator from '../../utils/cpfValidator';
import language, { errors as errorsLanguage } from '../../utils/language';

// components
import Box from '../../components/Box';
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';
import RadioGroup from '../../components/RadioGroup';
import TermPolity from '../../components/TermPolity';

const keysByStep = {
  0: ['cpf', 'sexo', 'nome', 'email', 'celular', 'nascimento'],
  1: ['senha', 'confirma_senha'],
};

function RegisterClient() {
  const history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const navigator = useSelector(state => state.navigator);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(registerDefault);

  useEffect(() => {
    if (auth.uid) {
      dispatch(actionsAuth.logout());
    }
  }, [auth, auth.uid]);

  function handleChange(event) {
    let { id, value } = event.target;

    switch (id) {
      case 'cpf':
        value = format.cpf(value, register[id]);
        break;

      case 'nascimento':
        value = format.birthday(value, register[id]);
        break;

      case 'celular':
        value = format.phone(value, register[id]);
        break;

      default:
        break;
    }

    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  function handleBlur(event) {
    let message = '';
    const { id, value } = event.target;

    const setMessage = (type = 'invalid', length = '') => {
      message = errorsLanguage[type]
        .replace('[field]', language['register.client.input'][id].label)
        .replace('[length]', length);
    };

    if (!value) {
      message = errorsLanguage.empty.replace(
        '[field]',
        language['register.client.input'][id].label,
      );
    } else {
      switch (id) {
        case 'cpf':
          if (!cpfValidator(value)) setMessage();
          break;

        case 'nascimento':
          if (!moment(value, 'DD/MM/YYYY').validate()) setMessage();
          break;

        case 'senha':
        case 'confirma_senha':
          if (value.length < 6) setMessage('length', '6');
          break;

        default:
          break;
      }
    }

    setErrors(prevErrors => ({ ...prevErrors, [id]: message }));
  }

  async function handleSave(event) {
    try {
      event.preventDefault();

      // validação da senha
      if (step === 1) {
        if (register.senha && register.confirma_senha) {
          if (register.senha !== register.confirma_senha) {
            return setErrors(prevErrors => ({
              ...prevErrors,
              confirma_senha: errorsLanguage.password,
            }));
          }
        }
      }

      if (step <= 0) {
        return handleStep('next');
      }

      handleLoading('on');
      const url = '/clientes/cadastrar';
      const { confirma_senha, ...data } = register;
      const request = await api.post(url, data);

      if (!request.id) {
        return toast.error(errorsLanguage.register);
      }
      setTimeout(() => {
        return history.push('/success', {
          ...language['register.client.success'],
          path: '/login',
          state: { type: 'client', login: register.cpf },
        });
      }, 500);
    } catch (err) {
      const error = _.get(err, 'response.data', err.message);

      if (typeof error === 'string') {
        return toast.error(error);
      }

      switch (error.codigo) {
        case 24: // Cliente já cadastrado
          toast.info(error.erro);
          return history.push('/login', {
            type: 'client',
            login: register.cpf,
          });

        default:
          toast.warning(error.erro);
          break;
      }
    } finally {
      handleLoading();
    }
  }

  function handleStep(type = 'back') {
    setStep(prevStep => (type === 'next' ? prevStep + 1 : prevStep - 1));
  }

  function handleLoading(action = 'off') {
    setLoading(prevLoading => {
      if (action === 'on' && !prevLoading) return true;
      if (action === 'off' && prevLoading) return false;
      return prevLoading;
    });
  }

  const getCol = useCallback(
    id => {
      return getColSize(id, inputsize);
    },
    [navigator.window.size],
  );

  const disabledBtnSubmit = useMemo(() => {
    return (
      Object.keys(register).filter(
        key => keysByStep[step].includes(key) && !register[key],
      ).length > 0 ||
      Object.keys(errors).filter(
        key => keysByStep[step].includes(key) && errors[key],
      ).length > 0
    );
  }, [step, register, errors]);

  return (
    <div>
      <Panel title={language['register.client.title']} />
      <div className={styles.container} data-step={step}>
        <Box onBack={step ? handleStep : undefined}>
          <Carousel step={step}>
            <Carousel.Step>
              <h1>{language['register.client.step0.title']}</h1>
              <form onSubmit={handleSave}>
                <Input
                  id="nome"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  value={register.nome}
                  onChange={handleChange}
                  help={errors.nome || ''}
                  {...language['register.client.input'].nome}
                />
                <Input
                  id="cpf"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  value={register.cpf}
                  onChange={handleChange}
                  help={errors.cpf || ''}
                  {...language['register.client.input'].cpf}
                />
                <Input
                  col={getCol}
                  id="nascimento"
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={register.nascimento}
                  help={errors.nascimento || ''}
                  {...language['register.client.input'].nascimento}
                />
                <Input
                  id="celular"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={register.celular}
                  help={errors.celular || ''}
                  {...language['register.client.input'].celular}
                />
                <Input
                  id="email"
                  col={getCol}
                  htmlType="email"
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  value={register.email}
                  onChange={handleChange}
                  help={errors.email || ''}
                  {...language['register.client.input'].email}
                />
                <RadioGroup
                  id="sexo"
                  col={getCol}
                  disabled={loading}
                  value={register.sexo}
                  onChange={handleChange}
                  options={[
                    { value: 1, label: 'Masculino' },
                    { value: 2, label: 'Feminino' },
                  ]}
                  {...language['register.client.input'].sexo}
                />
                <div>
                  <Button
                    htmlType="submit"
                    loading={loading}
                    icon="fa fa-angle-right"
                    disabled={disabledBtnSubmit}
                  >
                    {language['component.button.next.text']}
                  </Button>
                </div>
              </form>
            </Carousel.Step>
            <Carousel.Step>
              <h1>{language['register.client.step1.title']}</h1>
              <form onSubmit={handleSave}>
                <Input
                  id="senha"
                  helpType="error"
                  disabled={loading}
                  htmlType="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  help={errors.senha || ''}
                  value={register.senha || ''}
                  placeholder={
                    language['register.client.input'].senha.placeholder
                  }
                />
                <Input
                  helpType="error"
                  disabled={loading}
                  id="confirma_senha"
                  htmlType="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={register.confirma_senha}
                  help={errors.confirma_senha || ''}
                  placeholder={
                    language['register.client.input'].confirma_senha.placeholder
                  }
                />
                <TermPolity />
                <div>
                  <Button
                    htmlType="submit"
                    icon="fa fa-check"
                    loading={loading}
                    disabled={disabledBtnSubmit}
                  >
                    {language['component.button.register.text']}
                  </Button>
                </div>
              </form>
            </Carousel.Step>
          </Carousel>
        </Box>
      </div>
    </div>
  );
}

export default RegisterClient;

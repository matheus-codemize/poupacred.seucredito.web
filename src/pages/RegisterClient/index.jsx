import React, { useMemo, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';

// redux
import actionsAuth from '../../redux/actions/auth';
import actionsContainer from '../../redux/actions/container';

// resources
import inputsize from '../../resources/data/inputsize/client';
import registerDefault from '../../resources/data/register/client';

// services
import api from '../../services/api';

// utils
import toast from '../../utils/toast';
import moment from '../../utils/moment';
import validator from '../../utils/validator';
import getColSize from '../../utils/getColSize';
import language, { errors as errorsLanguage } from '../../utils/language';

// components
import Box from '../../components/Box';
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';
import RadioGroup from '../../components/RadioGroup';
import TermPolity from '../../components/TermPolity';

const languagePage = language['page.register.client'];
const languageForm = language['component.form.props'];

const keysByStep = {
  0: ['cpf', 'sexo', 'nome', 'email', 'celular', 'nascimento'],
  1: ['senha', 'confirma_senha'],
};

function RegisterClient() {
  // resources hooks
  const history = useHistory();
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);
  const navigator = useSelector(state => state.navigator);

  // component state
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [register, setRegister] = useState(registerDefault);

  useEffect(() => {
    if (auth.uid) {
      dispatch(actionsAuth.logout());
    }
  }, [auth, auth.uid]);

  function handleChange(event) {
    const { id, value } = event.target;
    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  function handleBlur(event) {
    let message = '';
    const { id, value } = event.target;

    const setMessage = (type = 'invalid', length = '') => {
      message = errorsLanguage[type]
        .replace('[field]', languageForm[id].label)
        .replace('[length]', length);
    };

    if (!value) {
      message = errorsLanguage.empty.replace('[field]', languageForm[id].label);
    } else {
      switch (id) {
        case 'cpf':
          if (!validator.cpf(value)) setMessage();
          break;

        case 'nascimento':
          if (!moment(value, 'DD/MM/YYYY').isValid()) setMessage();
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

      if (!step) {
        return setStep(prevStep => prevStep + 1);
      }

      dispatch(actionsContainer.loading());
      const url = '/clientes/cadastrar';
      const { confirma_senha, ...data } = register;
      const request = await api.post(url, data);

      if (!request.id) {
        return toast.error(errorsLanguage.register);
      }

      setTimeout(() => {
        return history.push('/sucesso', {
          ...languagePage.success,
          path: '/login',
          state: {
            login: {
              type: 'client',
              register: { login: register.cpf, senha: register.senha },
            },
          },
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
            login: {
              type: 'client',
              register: { login: register.cpf },
            },
          });

        default:
          toast.warning(error.erro);
          break;
      }
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function handleBack() {
    if (!step) return history.goBack();
    setErrors({});
    setStep(prevStep => prevStep - 1);
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
      <Panel useDivider title={languagePage.title}>
        <Panel.Body>
          <form
            data-step={step}
            onSubmit={handleSave}
            className={styles.container}
          >
            <Box
              onBack={handleBack}
              size={step && navigator.window.size.x >= 500 ? 'sm' : 'lg'}
            >
              <h1>{languagePage.stepTitles[step]}</h1>
              <Carousel step={step}>
                <Carousel.Step>
                  <div className={styles.form}>
                    <Input
                      id="nome"
                      col={getCol}
                      helpType="error"
                      onBlur={handleBlur}
                      value={register.nome}
                      onChange={handleChange}
                      help={errors.nome || ''}
                      {...languageForm.nome}
                    />
                    <Input
                      id="cpf"
                      type="cpf"
                      col={getCol}
                      helpType="error"
                      onBlur={handleBlur}
                      value={register.cpf}
                      onChange={handleChange}
                      help={errors.cpf || ''}
                      {...languageForm.cpf}
                    />
                    <Input
                      col={getCol}
                      id="nascimento"
                      type="birthday"
                      helpType="error"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={register.nascimento}
                      help={errors.nascimento || ''}
                      {...languageForm.nascimento}
                    />
                    <Input
                      id="celular"
                      type="phone"
                      col={getCol}
                      helpType="error"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={register.celular}
                      help={errors.celular || ''}
                      {...languageForm.celular}
                    />
                    <Input
                      id="email"
                      col={getCol}
                      htmlType="email"
                      helpType="error"
                      onBlur={handleBlur}
                      value={register.email}
                      onChange={handleChange}
                      help={errors.email || ''}
                      {...languageForm.email}
                    />
                    <RadioGroup
                      id="sexo"
                      col={getCol}
                      value={register.sexo}
                      onChange={handleChange}
                      options={[
                        { value: 1, label: 'Masculino' },
                        { value: 2, label: 'Feminino' },
                      ]}
                      {...languageForm.sexo}
                    />
                  </div>
                </Carousel.Step>
                <Carousel.Step>
                  <Input
                    id="senha"
                    helpType="error"
                    htmlType="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    help={errors.senha || ''}
                    value={register.senha || ''}
                    placeholder={languageForm.senha.placeholder}
                  />
                  <Input
                    helpType="error"
                    id="confirma_senha"
                    htmlType="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={register.confirma_senha}
                    help={errors.confirma_senha || ''}
                    placeholder={languageForm.confirmaSenha.placeholder}
                  />
                  <TermPolity />
                </Carousel.Step>
              </Carousel>
              <Button
                htmlType="submit"
                disabled={disabledBtnSubmit}
                {...language[`component.button.${step ? 'register' : 'next'}`]}
              />
            </Box>
          </form>
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default RegisterClient;

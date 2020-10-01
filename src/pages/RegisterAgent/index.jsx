import React, { useMemo, useEffect, useState } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsAuth from '../../redux/actions/auth';

// resources
import inputsize from '../../resources/data/inputsize/agent';
import registerDefault from '../../resources/data/register/agent';

// services
import api from '../../services/api';
import cepApi from '../../services/cep';

// utils
import toast from '../../utils/toast';
import moment from '../../utils/moment';
import format from '../../utils/format';
import getColSize from '../../utils/getColSize';
import cpfValidator from '../../utils/cpfValidator';
import language, { errors as errorsLanguage } from '../../utils/language';

// assets
import Term from '../../assets/documents/politica_privacidade.pdf';
import Polity from '../../assets/documents/politica_privacidade.pdf';

// components
import Box from '../../components/Box';
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';
import RadioGroup from '../../components/RadioGroup';
import InputFile from '../../components/InputFile';

const keysByStep = {
  0: ['cpf', 'sexo', 'nome', 'email', 'celular', 'nascimento', 'rg_cnh'],
  1: ['cep', 'bairro', 'cidade', 'endereco', 'comprovante_endereco'],
  2: ['certificacao', 'curriculo'],
};

function RegisterAgent() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const navigator = useSelector(state => state.navigator);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(registerDefault);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (auth.token) {
      dispatch(actionsAuth.logout());
    }
  }, [auth, auth.token]);

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

      case 'cep':
        value = format.zipcode(value, register[id]);
        break;

      default:
        break;
    }

    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  async function handleBlur(event) {
    let message = '';
    const { id, value } = event.target;

    const setMessage = (type = 'invalid', length = '') => {
      message = errorsLanguage[type]
        .replace('[field]', language['register.agent.input'][id].label)
        .replace('[length]', length);
    };

    /**
     * busca de cep da api
     */
    if (id === 'cep') {
      handleLoading('on');
      const dataCep = await cepApi(value);
      handleLoading();
      if (dataCep) {
        const { id, uf, localidade, logradouro, ...restDataCep } = dataCep;
        return setRegister(prevRegister => ({
          ...prevRegister,
          ...restDataCep,
          estado: uf,
          cidade: localidade,
          endereco: logradouro,
        }));
      }
    }

    if (!value) {
      message = errorsLanguage.empty.replace(
        '[field]',
        language['register.agent.input'][id].label,
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

      if (step <= 1) {
        return handleStep('next');
      }

      handleLoading('on');
      const url = '/agentes/cadastrar';
      const request = await api.post(url, register);

      if (!request.id) {
        return toast.error(errorsLanguage.register);
      }
      setTimeout(() => {
        return history.push('/success', {
          ...language['register.agent.success'],
          path: '/login',
          state: { type: 'agent', login: register.cpf },
        });
      }, 1000);
    } catch (err) {
      const error = _.get(err, 'response.data', err.message);

      if (typeof error === 'string') {
        return toast.error(error);
      }

      switch (error.codigo) {
        case 4: // Agente já cadastrado
          toast.info(error.erro);
          return history.push('/login', {
            type: 'agent',
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

  function getCol(id) {
    return getColSize(id, inputsize);
  }

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
      <Panel title={language['register.agent.title']} />
      <div className={styles.container} data-step={step}>
        <Box onBack={step === 1 ? handleStep : undefined}>
          <Carousel step={step}>
            <Carousel.Step>
              <h1>{language['register.agent.step0.title']}</h1>
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
                  {...language['register.agent.input'].nome}
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
                  {...language['register.agent.input'].cpf}
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
                  {...language['register.agent.input'].nascimento}
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
                  {...language['register.agent.input'].celular}
                />
                <Input
                  id="email"
                  col={getCol}
                  helpType="error"
                  htmlType="email"
                  disabled={loading}
                  onBlur={handleBlur}
                  value={register.email}
                  onChange={handleChange}
                  help={errors.email || ''}
                  {...language['register.agent.input'].email}
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
                  {...language['register.agent.input'].sexo}
                />
                <InputFile
                  id="rg_cnh"
                  col={getCol}
                  helpType="error"
                  onChange={handleChange}
                  help={errors.rg_cnh || ''}
                  {...language['register.agent.input'].rg_cnh}
                />
                <div>
                  <Button
                    loading={loading}
                    htmlType="submit"
                    icon="fa fa-angle-right"
                    // disabled={disabledBtnSubmit}
                  >
                    {language['component.button.next.text']}
                  </Button>
                </div>
              </form>
            </Carousel.Step>
            <Carousel.Step>
              <h1>{language['register.agent.step1.title']}</h1>
              <form onSubmit={handleSave}>
                <Input
                  id="cep"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  help={errors.cep || ''}
                  value={register.cep || ''}
                  {...language['register.agent.input'].cep}
                />
                <Input
                  id="estado"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  help={errors.estado || ''}
                  value={register.estado || ''}
                  {...language['register.agent.input'].estado}
                />
                <Input
                  id="cidade"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  help={errors.cidade || ''}
                  value={register.cidade || ''}
                  {...language['register.agent.input'].cidade}
                />
                <Input
                  id="bairro"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  help={errors.bairro || ''}
                  value={register.bairro || ''}
                  {...language['register.agent.input'].bairro}
                />
                <Input
                  id="endereco"
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  help={errors.endereco || ''}
                  value={register.endereco || ''}
                  {...language['register.agent.input'].endereco}
                />
                <Input
                  col={getCol}
                  helpType="error"
                  disabled={loading}
                  id="numero_endereco"
                  onChange={handleChange}
                  help={errors.numero_endereco || ''}
                  value={register.numero_endereco || ''}
                  {...language['register.agent.input'].numero_endereco}
                />
                <Input
                  col={getCol}
                  id="complemento"
                  helpType="error"
                  disabled={loading}
                  onChange={handleChange}
                  help={errors.complemento || ''}
                  value={register.complemento || ''}
                  {...language['register.agent.input'].complemento}
                />
                <InputFile
                  col={getCol}
                  helpType="error"
                  onChange={handleChange}
                  id="comprovante_endereco"
                  help={errors.comprovante_endereco || ''}
                  {...language['register.agent.input'].comprovante_endereco}
                />
                <div>
                  <Button
                    loading={loading}
                    htmlType="submit"
                    icon="fa fa-angle-right"
                    disabled={disabledBtnSubmit}
                  >
                    {language['component.button.next.text']}
                  </Button>
                </div>
              </form>
            </Carousel.Step>
            <Carousel.Step>
              <h1>{language['register.agent.step2.title']}</h1>
              <form onSubmit={handleSave}>
                <p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: language['agree.term.polity']
                        .replace(
                          '$term',
                          `<a href=${Term} target='_blank'>${language['term']}</a>`,
                        )
                        .replace(
                          '$polity',
                          `<a href=${Polity} target='_blank'>${language['polity']}</a>`,
                        ),
                    }}
                  />
                </p>
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

export default RegisterAgent;

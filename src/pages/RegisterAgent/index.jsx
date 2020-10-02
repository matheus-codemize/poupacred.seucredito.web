import React, { useMemo, useEffect, useState, useCallback } from 'react';
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
import * as estadoApi from '../../services/estado';
import * as cidadeApi from '../../services/cidade';

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
import Select from '../../components/Select';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';
import InputFile from '../../components/InputFile';
import RadioGroup from '../../components/RadioGroup';
import TermPolity from '../../components/TermPolity';

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

  // state - lists
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    getEstados();
  }, []);

  useEffect(() => {
    if (auth.uid) {
      dispatch(actionsAuth.logout());
    }
  }, [auth, auth.uid]);

  useEffect(() => {
    getCidades();
  }, [register.estado]);

  async function getEstados() {
    const data = await estadoApi.list();
    setEstados(data);
  }

  async function getCidades() {
    const data = await cidadeApi.listByEstado(register.estado);
    setCidades(data);
  }

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

      case 'estado':
        return setRegister(prevRegister => ({
          ...prevRegister,
          [id]: value,
          cidade: '',
        }));

      default:
        break;
    }

    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  async function handleBlur(event) {
    let message = '';
    const { id, value } = event.target;

    const setMessage = () => {
      message = errorsLanguage.invalid.replace(
        '[field]',
        language['register.agent.input'][id].label,
      );
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
        const estadoSelected = estados.find(estado => estado.uf === uf);
        return setRegister(prevRegister => ({
          ...prevRegister,
          ...restDataCep,
          cidade: id,
          endereco: logradouro,
          estado: estadoSelected ? estadoSelected.value : '',
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
      const { estado, ...data } = register;
      await api.post(url, data);

      return history.push('/success', {
        ...language['register.agent.success'],
        path: '/login',
        state: { type: 'agent', login: register.cpf },
      });
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

        case 32: // Agente com cadastro em aanálise
          toast.info(error.erro);
          return history.push('/');

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
  }, [step, loading, register, errors]);

  return (
    <div>
      <Panel title={language['register.agent.title']} />
      <div className={styles.container} data-step={step}>
        <Box onBack={step ? handleStep : undefined}>
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
                  accept=".png, .jpeg, .jpg, .pdf"
                  {...language['register.agent.input'].rg_cnh}
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
                <Select
                  id="estado"
                  col={getCol}
                  helpType="error"
                  options={estados}
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  help={errors.estado || ''}
                  value={register.estado || ''}
                  {...language['register.agent.input'].estado}
                />
                <Select
                  id="cidade"
                  col={getCol}
                  helpType="error"
                  options={cidades}
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
                  accept=".png, .jpeg, .jpg, .pdf"
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
                <Input
                  col={getCol}
                  id="certificacao"
                  helpType="error"
                  disabled={loading}
                  onChange={handleChange}
                  help={errors.certificacao || ''}
                  value={register.certificacao || ''}
                  {...language['register.agent.input'].certificacao}
                />
                <InputFile
                  col={getCol}
                  id="curriculo"
                  helpType="error"
                  onChange={handleChange}
                  help={errors.curriculo || ''}
                  accept=".png, .jpeg, .jpg, .pdf"
                  {...language['register.agent.input'].curriculo}
                />
                <TermPolity />
                <div>
                  <Button
                    htmlType="submit"
                    icon="fa fa-check"
                    loading={loading}
                    disabled={loading || disabledBtnSubmit}
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

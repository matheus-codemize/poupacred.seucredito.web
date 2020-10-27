import React, { useMemo, useEffect, useState, useCallback } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsAuth from '../../redux/actions/auth';
import actionsContainer from '../../redux/actions/container';

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
import validator from '../../utils/validator';
import getColSize from '../../utils/getColSize';
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

const languagePage = language['page.register.agent'];
const languageForm = language['component.form.props'];

const keysByStep = {
  0: ['cpf', 'sexo', 'nome', 'email', 'celular', 'nascimento', 'rg_cnh'],
  1: ['cep', 'bairro', 'cidade', 'endereco', 'comprovante_endereco'],
  2: ['certificacao', 'curriculo'],
};

function RegisterAgent() {
  // resources hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);
  const container = useSelector(state => state.container);
  const navigator = useSelector(state => state.navigator);

  // component state
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(registerDefault);
  // lists
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
      case 'nascimento':
        value = format.birthday(value, register[id]);
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
        languageForm[id].label,
      );
    };

    /**
     * busca de cep da api
     */
    if (id === 'cep') {
      dispatch(actionsContainer.loading());
      const dataCep = await cepApi(value);
      dispatch(actionsContainer.close());

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
      message = errorsLanguage.empty.replace('[field]', languageForm[id].label);
    } else {
      switch (id) {
        case 'cpf':
          if (!validator.cpf(value)) setMessage();
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
        return setStep(prevStep => prevStep + 1);
      }

      dispatch(actionsContainer.loading());
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

        case 32: // Agente com cadastro em análise
          toast.info(error.erro);
          return history.push('/');

        default:
          toast.warning(error.erro);
          break;
      }
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  function backStep() {
    if (!step) return history.goBack();
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
      container.loading ||
      Object.keys(register).filter(
        key => keysByStep[step].includes(key) && !register[key],
      ).length > 0 ||
      Object.keys(errors).filter(
        key => keysByStep[step].includes(key) && errors[key],
      ).length > 0
    );
  }, [step, register, errors, container.loading]);

  return (
    <div>
      <Panel title={languagePage.title}>
        <Panel.Body>
          <div className={styles.container} data-step={step}>
            <Box onBack={backStep}>
              <h1>{languagePage.titleSteps[step]}</h1>
              <form onSubmit={handleSave}>
                <Carousel step={step}>
                  <Carousel.Step>
                    <div className={styles.form}>
                      <Input
                        id="nome"
                        col={getCol}
                        helpType="error"
                        disabled={loading}
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
                        disabled={loading}
                        onBlur={handleBlur}
                        value={register.cpf}
                        onChange={handleChange}
                        help={errors.cpf || ''}
                        {...languageForm.cpf}
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
                        {...languageForm.nascimento}
                      />
                      <Input
                        type="phone"
                        id="celular"
                        col={getCol}
                        helpType="error"
                        disabled={loading}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={register.celular}
                        help={errors.celular || ''}
                        {...languageForm.celular}
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
                        {...languageForm.email}
                      />
                      <RadioGroup
                        id="sexo"
                        col={getCol}
                        direction="row"
                        disabled={loading}
                        value={register.sexo}
                        onChange={handleChange}
                        options={[
                          { value: 1, label: 'Masculino' },
                          { value: 2, label: 'Feminino' },
                        ]}
                        {...languageForm.sexo}
                      />
                      <InputFile
                        id="rg_cnh"
                        col={getCol}
                        helpType="error"
                        onChange={handleChange}
                        help={errors.rg_cnh || ''}
                        {...languageForm.rg_cnh}
                      />
                    </div>
                  </Carousel.Step>
                  <Carousel.Step>
                    <div className={styles.form}>
                      <Input
                        id="cep"
                        type="cep"
                        col={getCol}
                        helpType="error"
                        disabled={loading}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        help={errors.cep || ''}
                        value={register.cep || ''}
                        {...languageForm.cep}
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
                        {...languageForm.estado}
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
                        {...languageForm.cidade}
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
                        {...languageForm.bairro}
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
                        {...languageForm.endereco}
                      />
                      <Input
                        col={getCol}
                        helpType="error"
                        disabled={loading}
                        id="numero_endereco"
                        onChange={handleChange}
                        help={errors.numero_endereco || ''}
                        value={register.numero_endereco || ''}
                        {...languageForm.numero_endereco}
                      />
                      <Input
                        col={getCol}
                        id="complemento"
                        helpType="error"
                        disabled={loading}
                        onChange={handleChange}
                        help={errors.complemento || ''}
                        value={register.complemento || ''}
                        {...languageForm.complemento}
                      />
                      <InputFile
                        col={getCol}
                        helpType="error"
                        onChange={handleChange}
                        id="comprovante_endereco"
                        accept=".png, .jpeg, .jpg, .pdf"
                        help={errors.comprovante_endereco || ''}
                        {...languageForm.comprovante_endereco}
                      />
                    </div>
                  </Carousel.Step>
                  <Carousel.Step>
                    <div className={styles.form}>
                      <Input
                        col={getCol}
                        id="certificacao"
                        helpType="error"
                        disabled={loading}
                        onChange={handleChange}
                        help={errors.certificacao || ''}
                        value={register.certificacao || ''}
                        {...languageForm.certificacao}
                      />
                      <InputFile
                        col={getCol}
                        id="curriculo"
                        helpType="error"
                        onChange={handleChange}
                        help={errors.curriculo || ''}
                        accept=".png, .jpeg, .jpg, .pdf"
                        {...languageForm.curriculo}
                      />
                      <TermPolity />
                    </div>
                  </Carousel.Step>
                </Carousel>
                <Button
                  data-unique
                  htmlType="submit"
                  disabled={disabledBtnSubmit}
                  {...language[
                    `component.button.${step === 2 ? 'register' : 'next'}`
                  ]}
                />
              </form>
            </Box>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default RegisterAgent;

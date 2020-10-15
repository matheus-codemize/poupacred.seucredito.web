import React, { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsNavigator from '../../../../redux/actions/navigator';

// services
import api from '../../../../services/api';
import * as simulacaoApi from '../../../../services/simulacao';

// utils
import toast from '../../../../utils/toast';
import format from '../../../../utils/format';
import validator from '../../../../utils/validator';
import language, { errors as errorsLanguage } from '../../../../utils/language';

// resources
import registerDefault from '../../../../resources/data/simulacao/register';

// components
import Box from '../../../../components/Box';
import Panel from '../../../../components/Panel';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import Carousel from '../../../../components/Carousel';
import InputDate from '../../../../components/InputDate';

const languagePage = language['page.simulation'];
const languageForm = language['component.form.props'];

const components = { Input, Select, InputDate };
const mapKeyProps = { opcoes: 'options', multiplo: 'multiple' };
const keysStep = ['cpf', 'nome', 'nascimento', 'celular', 'email', 'produto'];

function CreateSimulation({ ...rest }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [error, setError] = useState({});
  const [steps, setSteps] = useState([]);
  const [register, setRegister] = useState({ ...registerDefault });

  // lists
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    simulacaoApi.listProduto().then(setProdutos);
  }, []);

  useEffect(() => {
    getClientByCpf();
  }, [register.cpf]);

  async function getClientByCpf() {
    try {
      if (register.cpf && register.cpf.length === 14) {
        dispatch(actionsNavigator.startLoading());
        const url = `/simulacoes/clientes/buscar?cpf=${register.cpf}`;
        const response = await api.get(url);
        setRegister(prevRegister => ({ ...prevRegister, ...response }));
      }
    } catch (err) {
    } finally {
      dispatch(actionsNavigator.finishLoading());
    }
  }

  function handleBack() {
    if (!step) return history.goBack();
    setStep(prevStep => prevStep - 1);
  }

  async function handleNext(event) {
    try {
      event.preventDefault();

      let response = [];
      const url = '/simulacoes/produtos/campos';

      if (step === keysStep.length - 1 && !steps.length) {
        dispatch(actionsNavigator.startLoading());
        response = await api.post(url, register);
        setSteps(response);
      }

      if (
        steps.length &&
        step - keysStep.length === steps.length - 1 &&
        steps[step - keysStep.length].propriedades &&
        steps[step - keysStep.length].propriedades.step
      ) {
        dispatch(actionsNavigator.startLoading());
        response = await api.post(url, {
          ...register,
          step: steps[step - keysStep.length].propriedades.step,
        });
        setSteps(prevSteps => [...prevSteps, ...response]);
      }

      setStep(prevStep => prevStep + 1);
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsNavigator.finishLoading());
    }
  }

  async function handleSave(event) {
    try {
      event.preventDefault();

      let url, response;

      if (
        step !== keysStep.length - 1 &&
        step - keysStep.length < steps.length - 1 &&
        (!steps.length || !steps[step - keysStep.length].propriedades.step)
      ) {
        return setStep(prevStep => prevStep + 1);
      }

      url = '/simulacoes/produtos/campos';
      dispatch(actionsNavigator.startLoading());

      // último step conhecido (produto)
      if (step === keysStep.length - 1) {
        response = await api.post(url, register);
        setSteps(response);
        return setStep(prevStep => prevStep + 1);
      }

      if (
        steps[step - keysStep.length].propriedades &&
        steps[step - keysStep.length].propriedades.step
      ) {
        response = await api.post(url, {
          ...register,
          step: steps[step - keysStep.length].propriedades.step,
        });
        setSteps(prevSteps => [...prevSteps, ...response]);
        return setStep(prevStep => prevStep + 1);
      }
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsNavigator.finishLoading());
    }
  }

  function handleChange(event) {
    let { id, value } = event.target;
    setError(prevError => ({ ...prevError, [id]: '' }));

    switch (id) {
      case 'cpf':
        value = format.cpf(value, register[id]);
        break;

      case 'produto':
        setSteps([]);
        return setRegister(prevRegister => {
          Object.keys(prevRegister).forEach(key => {
            if (!keysStep.includes(key)) {
              delete prevRegister[key];
            }
          });
          return { ...prevRegister, [id]: value };
        });

      default:
        if (!keysStep.includes(id) && steps.length) {
          const index = steps.findIndex(item => item.id === id);
          if (
            index >= 0 &&
            index < steps.length - 1 &&
            steps[index].propriedades &&
            steps[index].propriedades.step
          ) {
            setSteps(prevSteps => prevSteps.slice(0, index + 1));
            return setRegister(prevRegister => {
              console.log(
                Object.keys(prevRegister).slice(
                  Object.keys(prevRegister).indexOf(steps[index].id) + 1,
                ),
              );
              Object.keys(prevRegister)
                .slice(Object.keys(prevRegister).indexOf(steps[index].id) + 1)
                .forEach(key => {
                  delete prevRegister[key];
                });
              return { ...prevRegister, [id]: value };
            });
          }
        }
        break;
    }

    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  function handleBlur(event) {
    let message = '';
    const { id, value } = event.target;

    switch (id) {
      case 'cpf':
        if (!validator.cpf(value)) {
          message = errorsLanguage.invalid.replace(
            '[field]',
            languageForm.cpf.label,
          );
        }
        break;

      default:
        break;
    }

    setError(prevError => ({ ...prevError, [id]: message }));
  }

  const renderBtnNext = useMemo(() => {
    let key, disabled;
    const languageButton =
      language[
        `component.button.${
          steps.length > 0 &&
          step - keysStep.length === steps.length - 1 &&
          (!steps[steps.length - 1].propriedades ||
            !steps[steps.length - 1].propriedades.step)
            ? 'register'
            : 'next'
        }`
      ];

    if (step < keysStep.length) {
      key = keysStep[step];
      disabled = !!error[key] || !register[key];
    } else if (step - keysStep.length < steps.length) {
      key = steps[step - keysStep.length].id;
      disabled =
        !!error[key] ||
        (!register[key] && steps[step - keysStep.length].requerido);
    }

    return (
      <Button
        data-unique
        htmlType="submit"
        disabled={!!disabled}
        icon={languageButton.icon}
      >
        {languageButton.text}
      </Button>
    );
  }, [step, steps, error, register]);

  const renderSteps = useMemo(() => {
    return steps.map((item, index) => {
      if (Object.prototype.hasOwnProperty.call(item, 'propriedades')) {
        Object.keys(item.propriedades).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(mapKeyProps, key)) {
            switch (key) {
              case 'opcoes':
                item.propriedades[mapKeyProps[key]] = item.propriedades[
                  key
                ].map(optionItem => ({
                  ...optionItem,
                  value: optionItem.id,
                  label: optionItem.nome,
                }));
                break;

              default:
                item.propriedades[mapKeyProps[key]] = item.propriedades[key];
                break;
            }
            delete item.propriedades[key];
          }
        });
      }

      if (
        Object.prototype.hasOwnProperty.call(
          components,
          item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1),
        )
      ) {
        return (
          <Carousel.Step key={index}>
            {React.createElement(
              components[
                item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)
              ],
              {
                ...item.propriedades,
                id: item.id,
                label: item.titulo,
                onChange: handleChange,
                required: item.requerido,
                value: register[item.id] || '',
              },
            )}
          </Carousel.Step>
        );
      }
      return <></>;
    });
  }, [steps, register]);

  return (
    <div>
      <Panel title={languagePage.createTitle}>
        <Panel.Body>
          <form className={styles.form} onSubmit={handleNext}>
            <Box onBack={handleBack}>
              <Carousel step={step}>
                <Carousel.Step>
                  <Input
                    id="cpf"
                    helpType="error"
                    onBlur={handleBlur}
                    help={error.cpf || ''}
                    onChange={handleChange}
                    value={register.cpf || ''}
                    {...languageForm.cpf}
                  />
                </Carousel.Step>
                <Carousel.Step>
                  <Input
                    id="nome"
                    onChange={handleChange}
                    value={register.nome || ''}
                    {...languageForm.nome}
                  />
                </Carousel.Step>
                <Carousel.Step>
                  <InputDate
                    id="nascimento"
                    onChange={handleChange}
                    value={register.nascimento || ''}
                    {...languageForm.nascimento}
                  />
                </Carousel.Step>
                <Carousel.Step>
                  <Input
                    id="celular"
                    onChange={handleChange}
                    value={register.celular || ''}
                    {...languageForm.celular}
                  />
                </Carousel.Step>
                <Carousel.Step>
                  <Input
                    id="email"
                    htmlType="email"
                    onChange={handleChange}
                    value={register.email || ''}
                    {...languageForm.email}
                  />
                </Carousel.Step>
                <Carousel.Step>
                  <Select
                    id="produto"
                    options={produtos}
                    onChange={handleChange}
                    value={register.produto || ''}
                    {...languageForm.produto}
                  />
                </Carousel.Step>
                {renderSteps}
              </Carousel>
              {renderBtnNext}
            </Box>
          </form>
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default CreateSimulation;

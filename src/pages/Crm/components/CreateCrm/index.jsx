import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

// redux
import actionsNavigator from '../../../../redux/actions/navigator';
import actionsContainer from '../../../../redux/actions/container';

// assets
import backgroundImg from '../../../../assets/images/background/panel/crm.jpg';

// utils
import toast from '../../../../utils/toast';
import language, { errors as errorsLanguage } from '../../../../utils/language';

// services
import api from '../../../../services/api';
import * as crmApi from '../../../../services/crm';

// components
import Box from '../../../../components/Box';
import Panel from '../../../../components/Panel';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import Carousel from '../../../../components/Carousel';

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

function CreateCrm() {
  // resources hooks
  const history = useHistory();
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);

  // component state
  const [step, setStep] = useState(0);
  const [error, setError] = useState({});
  const [register, setRegister] = useState({});
  const [convenios, setConvenios] = useState([]);

  useEffect(() => {
    initComponent();
  }, []);

  async function initComponent() {
    dispatch(actionsContainer.loading());
    await Promise.all([getConvenios()]);
    dispatch(actionsContainer.close());
  }

  async function getConvenios() {
    const data = await crmApi.getConvenios();
    setConvenios(data);
  }

  function handleBack() {
    if (!step) return history.goBack();
    setStep(prevStep => prevStep - 1);
  }

  function handleChange(event) {
    const { id, value } = event.target;
    setError(prevError => ({ ...prevError, [id]: '' }));
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  async function handleSave(event) {
    try {
      event.preventDefault();
      const { convenio } = register;

      if (!convenio) {
        return setError(prevError => ({
          ...prevError,
          convenio: errorsLanguage.empty.replace(
            '[field]',
            languageForm.convenio.label,
          ),
        }));
      }

      if (!step) {
        return setStep(prevStep => prevStep + 1);
      }

      dispatch(actionsContainer.loading());
      await crmApi.requestMailing({ convenio });
      return history.push('/success', {
        path: '/crm',
        ...languagePage.success,
      });
    } catch (err) {
      const message = _.get(err, 'response.data.erro', err.message);
      toast.error(message);
    } finally {
      dispatch(actionsContainer.close());
    }
  }

  const disabledBtnRegister = useMemo(() => {
    return (
      Object.keys(error).filter(key => error[key]).length > 0 ||
      !register.convenio
    );
  }, [step, error, register]);

  return (
    <div>
      <Panel
        useDivider
        background={backgroundImg}
        title={languagePage.title}
        subtitle={languagePage.createTitle}
      >
        <Panel.Body>
          <form className={styles.form} onSubmit={handleSave}>
            <Box size="sm" onBack={handleBack}>
              <Carousel step={step}>
                <Carousel.Step>
                  <Select
                    id="convenio"
                    helpType="error"
                    options={convenios}
                    onChange={handleChange}
                    help={error.convenio || ''}
                    value={register.convenio || ''}
                    {...languageForm.convenio}
                  />
                </Carousel.Step>
                <Carousel.Step>
                  <div className={styles.detail}>
                    <label>{languagePage.details.agente}</label>
                    <p>{auth.nome}</p>
                  </div>
                  <div className={styles.detail}>
                    <label>{languagePage.details.convenioId}</label>
                    <p>{register.convenio || ''}</p>
                  </div>
                  <div className={styles.detail}>
                    <label>{languagePage.details.convenio}</label>
                    <p>
                      {register.convenio
                        ? convenios.find(
                            convenio => convenio.value === register.convenio,
                          ).label
                        : ''}
                    </p>
                  </div>
                </Carousel.Step>
              </Carousel>
              <Button
                light
                data-unique
                htmlType="submit"
                disabled={disabledBtnRegister}
                {...language[`component.button.${step ? 'next' : 'register'}`]}
              />
            </Box>
          </form>
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default CreateCrm;

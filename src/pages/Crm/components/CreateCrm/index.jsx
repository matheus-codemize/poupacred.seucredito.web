import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
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
import * as convenioApi from '../../../../services/convenio';

// components
import Box from '../../../../components/Box';
import Panel from '../../../../components/Panel';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import Carousel from '../../../../components/Carousel';

const languagePage = language['page.crm'];
const languageForm = language['component.form.props'];

function CreateCrm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const [step, setStep] = useState(0);
  const [error, setError] = useState({});
  const [register, setRegister] = useState({});
  const [convenios, setConvenios] = useState([]);

  useEffect(() => {
    getConvenios();
  }, []);

  async function getConvenios() {
    dispatch(actionsContainer.loading());
    const data = await convenioApi.list();
    setConvenios(data);
    dispatch(actionsContainer.close());
  }

  function handleBack() {
    if (step === 0) {
      return history.goBack();
    }

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

      if (!register.convenio) {
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
      // const url = '';
      // await api.post(url, { convenio: register.convenio });
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

  return (
    <div>
      <Panel
        useDivider
        background={backgroundImg}
        title={languagePage.title}
        subtitle={languagePage.createTitle}
      >
        <Panel.Body>
          <div className={styles.form}>
            <Box onBack={handleBack}>
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
                gradient
                onClick={handleSave}
                icon={`fas fa-${step ? 'check' : 'chevron-right'}`}
              >
                {step
                  ? languagePage.register
                  : language['component.button.next'].text}
              </Button>
            </Box>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default CreateCrm;

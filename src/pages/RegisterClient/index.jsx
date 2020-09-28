import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// redux
import actionsAuth from '../../redux/actions/auth';

// resources
import registerDefault from '../../resources/data/register/client';

// utils
import cpfFormat from '../../utils/cpfFormat';
import language, { errors as errorsLanguage } from '../../utils/language';

// assets
import Term from '../../assets/documents/politica_privacidade.pdf';
import Polity from '../../assets/documents/politica_privacidade.pdf';

// components
import Box from '../../components/Box';
import Panel from '../../components/Panel';
import Input from '../../components/Input';
import Radio from '../../components/Radio';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';
import RadioGroup from '../../components/RadioGroup';

function RegisterClient() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);

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
        value = cpfFormat(value, register.cpf);
        break;

      case 'nascimento':
        break;

      default:
        break;
    }

    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    setRegister(prevRegister => ({ ...prevRegister, [id]: value }));
  }

  function handleSave(event) {
    try {
      event.preventDefault();

      const err = {};

      switch (step) {
        case 0:
          Object.keys(register)
            .filter(key => key !== 'senha')
            .forEach(key => {
              if (!register[key]) {
                err[key] = errorsLanguage.empty.replace(
                  '[field]',
                  language['register.client.input'][key].label,
                );
              }
            });
          break;

        default:
          if (register.senha && confirmPassword) {
            if (register.senha !== confirmPassword) {
              err.confirmPassword = errorsLanguage.password;
            }
          } else {
            if (!register.senha) {
              err.senha = errorsLanguage.empty.replace(
                '[field]',
                language['register.client.input'].senha.label,
              );
            }
            if (!confirmPassword) {
              err.confirmPassword = errorsLanguage.empty.replace(
                '[field]',
                language['register.client.input'].confirma_senha.label,
              );
            }
          }
          break;
      }

      if (Object.keys(err).length) {
        return setErrors(err);
      }

      if (step <= 0) {
        return handleStep('next');
      }

      handleLoading();
    } catch (err) {
    } finally {
      if (loading) handleLoading();
    }
  }

  function handleStep(type = 'back') {
    setStep(prevStep => (type === 'next' ? prevStep + 1 : prevStep - 1));
  }

  function handleLoading() {
    setLoading(prevLoading => !prevLoading);
  }

  return (
    <div>
      <Panel title={language['register.client.title']} />
      <div className={styles.container} data-step={step}>
        <Box onBack={step === 1 ? handleStep : undefined}>
          <Carousel step={step}>
            <Carousel.Step>
              <h1>{language['register.client.step0.title']}</h1>
              <form onSubmit={handleSave}>
                <Input
                  id="nome"
                  disabled={loading}
                  value={register.nome}
                  onChange={handleChange}
                  help={errors.nome || ''}
                  {...language['register.client.input'].nome}
                />
                <Input
                  id="cpf"
                  disabled={loading}
                  value={register.cpf}
                  onChange={handleChange}
                  help={errors.cpf || ''}
                  {...language['register.client.input'].cpf}
                />
                <Input
                  id="nascimento"
                  disabled={loading}
                  onChange={handleChange}
                  value={register.nascimento}
                  help={errors.nascimento || ''}
                  {...language['register.client.input'].nascimento}
                />
                <Input
                  id="celular"
                  disabled={loading}
                  onChange={handleChange}
                  value={register.celular}
                  help={errors.celular || ''}
                  {...language['register.client.input'].celular}
                />
                <Input
                  id="email"
                  htmlType="email"
                  disabled={loading}
                  value={register.email}
                  onChange={handleChange}
                  help={errors.email || ''}
                  {...language['register.client.input'].email}
                />
                <RadioGroup
                  id="sexo"
                  disabled={loading}
                  value={register.sexo}
                  onChange={handleChange}
                  options={[
                    { value: 1, label: 'Masculino' },
                    { value: 2, label: 'Feminino' },
                  ]}
                  {...language['register.client.input'].sexo}
                />
                <Button
                  icon="fa fa-angle-right"
                  htmlType="submit"
                  loading={loading}
                >
                  {language['component.button.next.text']}
                </Button>
              </form>
            </Carousel.Step>
            <Carousel.Step>
              <h1>{language['register.client.step1.title']}</h1>
              <form onSubmit={handleSave}>
                <Input
                  id="senha"
                  htmlType="password"
                  onChange={handleChange}
                  help={errors.senha || ''}
                  value={register.senha || ''}
                  placeholder={
                    language['register.client.input'].senha.placeholder
                  }
                />
                <Input
                  id="confirma_senha"
                  htmlType="password"
                  value={confirmPassword}
                  help={errors.confirmPassword || ''}
                  onChange={({ target: { value } }) => {
                    setConfirmPassword(value);
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      confirmPassword: '',
                    }));
                  }}
                  placeholder={
                    language['register.client.input'].confirma_senha.placeholder
                  }
                />
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
                <Button
                  htmlType="submit"
                  icon="fa fa-check"
                  disabled={!register.senha || !confirmPassword}
                >
                  {language['component.button.register.text']}
                </Button>
              </form>
            </Carousel.Step>
          </Carousel>
        </Box>
      </div>
    </div>
  );
}

export default RegisterClient;

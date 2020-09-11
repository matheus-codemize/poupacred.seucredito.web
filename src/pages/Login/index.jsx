import React, { useState } from 'react';

// component
import Header from '../../components/Header';
import Button from '../../components/Button';
import Box from '../../components/Box';
import TitleSection from '../../components/TitleSection';
import Input from '../../components/Input';

import './styles.css';
const defaultLoginData = {
  type: '',
  userame: '',
  password: '',
};

function Login() {
  const [loginData, setLoginData] = useState({ ...defaultLoginData });
  const [showForm, setShowForm] = useState(false);

  function handleLoginType(type) {
    setShowForm(true);
    setLoginData(prevLoginData => ({ ...prevLoginData, type }));
  }

  function onChangeInput(e) {
    const { value, name } = e.target;

    setLoginData(prevLoginData => ({ ...prevLoginData, [name]: value }));
  }

  function submitForm(e) {
    const { username, password } = loginData;
    e.preventDefault();
  }

  function onBack() {
    setLoginData({ ...defaultLoginData });
    setShowForm(false);
  }
  return (
    <div id="login-page">
      <Header />
      <TitleSection title="Área exclusiva para clientes e agentes" />
      <Box className="box" backVisible={showForm} onBack={onBack}>
        {showForm ? (
          <form onSubmit={submitForm}>
            <Input
              label="CPF"
              name="username"
              htmlType="text"
              onChange={onChangeInput}
              placeholder="Digite seu CPF..."
            />
            <Input
              label="Senha"
              name="password"
              htmlType="password"
              onChange={onChangeInput}
              placeholder="Digite sua senha"
            />
            <div className="forgot-password">
              <Button color="link">Esqueci minha senha</Button>
            </div>
            <Button
              type="submit"
              color="success"
              icon="fa-sign-in"
              iconPosition="right"
            >
              Entrar
            </Button>
          </form>
        ) : (
          <>
            <h2 className="title">Entrar como:</h2>
            <Button
              icon="fa-user"
              onClick={() => handleLoginType('agent')}
              color="secondary"
            >
              Agente
            </Button>
            <Button
              icon="fa-user-tie"
              onClick={() => handleLoginType('client')}
            >
              Cliente
            </Button>
          </>
        )}
      </Box>
    </div>
  );
}

export default Login;

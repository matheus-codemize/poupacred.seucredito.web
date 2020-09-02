import React from 'react';

import './styles.css';
import TitleSection from '../../components/TitleSection';
import Box from '../../components/Box';
import Fieldset from '../../components/Fieldset';
import Input from '../../components/Input';
import InputFile from '../../components/InputFile';
import Button from '../../components/Button';
function Crm() {
  return (
    <div id="crm-page">
      <TitleSection title="Faça seu cadastro e comece a utilizar o sistema" />
      <Box className="box">
        <form>
          <Fieldset title="Dados Pessoais">
            <Input
              htmlType="text"
              label="Nome"
              name="name"
              placeholder="Digite seu nome"
            />
            <Input
              htmlType="text"
              label="CPF"
              name="cpf"
              placeholder="Digite seu CPF"
            />
            <Input htmlType="date" label="Data de Nascimento" name="birthday" />
            <Input
              htmlType="text"
              label="Celular"
              name="celphone"
              placeholder="Digite seu celular"
            />
            <Input
              htmlType="email"
              label="E-mail"
              name="email"
              placeholder="Digite seu e-mail"
            />
            <InputFile
              name="rg_cnh"
              label="RG/CNH"
              placeholder="Selecionar RG/CNH"
            />
          </Fieldset>
          <Fieldset title="Endereço">
            <Input
              htmlType="text"
              label="CEP"
              name="cep"
              placeholder="Digite seu CEP"
              sm="75"
            />
            <Input
              htmlType="text"
              label="Estado"
              name="uf"
              placeholder="Digite seu Estado"
              sm="25"
            />
            <Input
              htmlType="text"
              label="Cidade"
              name="city"
              placeholder="Digite sua cidade"
            />
            <Input
              htmlType="text"
              label="Bairro"
              name="neighborhood"
              placeholder="Digite seu bairro"
            />
            <Input
              htmlType="text"
              label="Logradouro"
              name="adress"
              placeholder="Digite seu logradouro"
            />
            <Input
              htmlType="text"
              label="Número"
              name="adress_number"
              placeholder="Digite seu número"
              sm="25"
            />
            <Input
              htmlType="text"
              label="Complemento"
              name="complement"
              placeholder="Digite seu complemento"
              sm="75"
            />
            <InputFile
              name="comprovante_residencia"
              label="Comprovante de Residência"
              placeholder="Selecionar Comprovante de Residência"
            />
          </Fieldset>
          <Fieldset title="Currículo/Certificações">
            <Input
              htmlType="text"
              label="Número Certificação ANEPS"
              name="anpes_number"
              placeholder="Digite seu CEP"
            />
            <InputFile
              name="curriculo"
              label="Currículo"
              placeholder="Selecionar Currículo"
            />
          </Fieldset>
          <Button type="submit" color="success" icon="fa-check">
            Cadastrar
          </Button>
        </form>
      </Box>
    </div>
  );
}

export default Crm;

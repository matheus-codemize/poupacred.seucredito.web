import React from 'react';
import { useHistory } from 'react-router-dom';
// style
import './styles.css';

// components
import Header from '../../components/Header';
import Button from '../../components/Button';
import FeatureItem from './FeatureItem';

function Landing() {
  const history = useHistory();
  function handleSignIn(type) {
    // TODO: TYPE AGENTE? TYPE CLIENTE
    history.push('/cadastro-agente');
  }
  return (
    <div id="landing-page">
      <Header />
      <main>
        <div className="content-sig-in">
          <h1>Realize Seus Planos Simule, Compare e Contrate.</h1>
          <p>
            Crédito Pessoal ou Consignado, várias opções e você escolhe a que
            mais lhe convém.
          </p>
          <div className="content-actions">
            <Button
              icon="fa-file-text"
              onClick={() => {
                handleSignIn('cliente');
              }}
            >
              Simule e Contrate
            </Button>
            <Button
              icon="fa-user"
              onClick={() => {
                handleSignIn('cliente');
              }}
            >
              Já sou Cliente
            </Button>
            <Button
              icon="fa-briefcase"
              color="secondary"
              onClick={() => {
                handleSignIn('agente');
              }}
            >
              Seja um Agente
            </Button>
          </div>
        </div>
        <div className="content-feature">
          <FeatureItem icon="fa-money" title="Cliente">
            Encontre a melhor opção para você
            <br />
            Nossa missão é acabar com os juros abusivos
            <br />
            Juros a partir de 1,29% ao mês
          </FeatureItem>
          <FeatureItem icon="fa-money" title="Agente">
            Você também pode realizar seus sonhos
            <br /> Nossa equipe vai agilizar suas operações
            <br />
            Várias modalidades de crádito
          </FeatureItem>
        </div>
      </main>
    </div>
  );
}

export default Landing;

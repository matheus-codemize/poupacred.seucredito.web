import React from 'react';
import { useHistory } from 'react-router-dom';
// style
import './styles.css';

// components
import Header from '../../components/Header';
import Button from '../../components/Button';

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
          <h1>Lorem Ipsum é simplesmente uma simulação de texto </h1>
          <p>
            Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um
            texto randômico. Com mais de 2000 anos
          </p>
          <div className="content-actions">
            <Button
              icon="fa-user"
              onClick={() => {
                handleSignIn('agente');
              }}
            >
              Seja um Agente
            </Button>
            <Button
              icon="fa-user-tie"
              color="secondary"
              onClick={() => {
                handleSignIn('cliente');
              }}
            >
              Seja um Cliente
            </Button>
          </div>
        </div>
        <div className="content-feature">features ...</div>
      </main>
    </div>
  );
}

export default Landing;

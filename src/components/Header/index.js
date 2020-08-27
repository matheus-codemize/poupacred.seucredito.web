import React, { useState } from "react"

// assets
import logo from "../../assets/images/logo.png"

// style
import "./style.css"

// components
import Button from "../Button"

function Header({ ...rest }) {
  const [errorLoadLogo, setErrorLoadLogo] = useState(false)

  function setErrorLogo() {
    if (!errorLoadLogo) setErrorLoadLogo(true)
  }

  function handleLogin() {}

  return (
    <header {...rest} id='header-app'>
      {!errorLoadLogo ? (
        <img src={logo} alt='logo' className='logo' onError={setErrorLogo} />
      ) : (
        <h2>TEM CRÉDITO</h2>
      )}
      <Button reverse icon='fa-sign-in-alt' onClick={handleLogin}>
        Entrar
      </Button>
    </header>
  )
}

export default Header

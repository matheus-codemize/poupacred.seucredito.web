import React from "react"

// components
import Button from "../../../components/Button"

function ButtonDemo() {
  return (
    <div style={style.container}>
      <div style={style.sectionButton}>
        <Button light type='primary' style={style.button}>
          Primary Light
        </Button>
        <Button type='primary' style={style.button}>
          Primary
        </Button>
        <Button dark type='primary' style={style.button}>
          Primary Dark
        </Button>
        <Button type='primary' gradient style={style.button}>
          Primary Gradient
        </Button>
        <hr />
        <Button light type='secondary' style={style.button}>
          Secondary Light
        </Button>
        <Button type='secondary' style={style.button}>
          Secondary
        </Button>
        <Button dark type='secondary' style={style.button}>
          Secondary Dark
        </Button>
        <Button type='secondary' gradient style={style.button}>
          Secondary Gradiente
        </Button>
      </div>
    </div>
  )
}

const style = {
  container: {
    display: "flex",
    height: "calc(100vh - 100px)",
  },
  sectionButton: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    marginBottom: 10,
  },
}

export default ButtonDemo

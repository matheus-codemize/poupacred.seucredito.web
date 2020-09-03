import React from "react"

// components
import Tabs from "../../components/Tabs"

// components to demo
import ButtonDemo from "./components/Button"

const { Tab } = Tabs

function Demo() {
  return (
    <div style={{ height: "100%", backgroundColor: "red" }}>
      <Tabs id='tab-demo'>
        <Tab label='Button'>
            <ButtonDemo />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Demo

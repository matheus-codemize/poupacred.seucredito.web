import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"

// style
import "./style.css"

// components internal
import Tab from "./components/Tab"

// components

function Tabs({ id, children, tab, ...rest }) {
  const [tabs, setTabs] = useState([])
  const [tabSelected, setTabSelected] = useState(0)

  useEffect(() => {
    setTabs(
      React.Children.map(children, (child, index) => {
        const { label, disabled } = child.props
        return { label, disabled }
      })
    )
  }, [])

  useEffect(() => {
    document.getElementById(id).style.transform = `translate(${
      -tabSelected * 100
    }%, 0px)`
  }, [tabSelected])

  useEffect(() => {
    setTabSelected(tab)
  }, [tab])

  function getClassItemHeader({ disabled, index }) {
    let classItem = "tab-label"
    classItem += disabled ? " disabled" : " not-disabled"
    classItem += index === tabSelected ? " selected" : " not-selected"
    return classItem
  }

  return (
    <div id='tabs'>
      <div className='header'>
        {tabs.map((options, index) => {
          const { label } = options
          return (
            <span
              onClick={() => setTabSelected(index)}
              className={getClassItemHeader({ ...options, index })}
            >
              {label}
            </span>
          )
        })}
      </div>
      <div className='body'>
        <div className='container-body'>
          <div id={id} className='container-tab'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

Tabs.Tab = Tab

Tabs.defaultProps = {
  tab: 0,
}

Tabs.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  tab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Tabs

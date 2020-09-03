import React from "react"
import PropTypes from "prop-types"

// style
import "./style.css"

function Tab({ label, children, ...rest }) {
  return <div className='tab'>{children}</div>
}

Tab.defaultProps = {}

Tab.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
}

export default Tab

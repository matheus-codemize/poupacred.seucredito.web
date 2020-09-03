import React, { useMemo } from "react"
import PropTypes from "prop-types"

// style
import "./style.css"

function Button({
  icon,
  type,
  dark,
  light,
  gradient,
  htmlType,
  children,
  iconPosition,
  ...rest
}) {
  const renderIcon = useMemo(() => {
    return icon && <i className={`fa ${icon}`} />
  }, [icon])

  const classBtn = useMemo(() => {
    let classItem = `btn ${type}`
    if (light) classItem += " light"
    else if (dark) classItem += " dark"
    else if (gradient) classItem += " gradient"
    return classItem
  }, [type, light, gradient, dark])

  return (
    <button {...rest} type={htmlType} className={classBtn}>
      {iconPosition === "left" && renderIcon}
      {children}
      {iconPosition === "right" && renderIcon}
    </button>
  )
}

Button.defaultProps = {
  icon: "",
  dark: false,
  light: false,
  gradient: false,
  type: "primary",
  htmlType: "button",
  iconPosition: "left",
}

Button.propTypes = {
  dark: PropTypes.bool,
  light: PropTypes.bool,
  icon: PropTypes.string,
  gradient: PropTypes.bool,
  type: PropTypes.oneOf(["primary", "secondary"]),
  iconPosition: PropTypes.oneOf(["left", "right"]),
  htmlType: PropTypes.oneOf(["button", "submit", "reset"]),
}

export default Button

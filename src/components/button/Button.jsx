import React from "react";

function SingleButton({
  btnTitle,
  onClick,
  type = "button",
  className = "",
  children,
  ...props
}) {
  return (
    <button type={type} className={className} onClick={onClick} {...props}>
      {children}
      {btnTitle}
    </button>
  );
}

export default SingleButton;

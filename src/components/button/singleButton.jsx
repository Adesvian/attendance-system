import React from "react";

function SingleButton({
  btnTitle,
  btnBg,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn ${btnBg} ${className}`}
      onClick={onClick}
      {...props}
    >
      {btnTitle}
    </button>
  );
}

export default SingleButton;

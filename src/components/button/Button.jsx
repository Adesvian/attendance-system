import React from "react";

function SingleButton({
  btnTitle,
  onClick,
  type = "button",
  className,
  children,
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`${className} rounded-md px-4 py-2 whitespace-nowrap focus:outline-none flex items-center justify-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={disabled ? null : onClick}
      disabled={disabled}
      {...props}
    >
      {children} {btnTitle}
    </button>
  );
}

export default SingleButton;

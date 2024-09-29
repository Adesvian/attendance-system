import React from "react";

function SingleButton({
  btnTitle,
  onClick,
  type = "button",
  className,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`${className} rounded-md px-4 py-2 whitespace-nowrap focus:outline-none flex items-center justify-center`}
      onClick={onClick}
      {...props}
    >
      {children} {btnTitle}
    </button>
  );
}

export default SingleButton;

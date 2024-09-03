import React from "react";

function ErrorText({ styleClass, children }) {
  return <p className={`text-error text-sm mb-2 ${styleClass}`}>{children}</p>;
}

export default ErrorText;

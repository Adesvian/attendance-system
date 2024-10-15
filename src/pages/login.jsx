import React from "react";
import LoginForm from "../features/user/Login";

function Login() {
  return (
    <div className="wrapper relative overflow-hidden">
      <img
        src="./assets/school-logo.png"
        alt="school logo"
        className="absolute top-5 left-7  w-24 h-24"
        loading="lazy"
      />
      <img
        src="./assets/school-logo-background.png"
        alt="school logo"
        className="absolute w-96 h-96 opacity-20 left-1/2 transform translate-y-1/3 -translate-x-1/2 lg:hidden"
        loading="lazy"
      />
      <LoginForm />
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import ErrorText from "../../components/input/ErrorText";

function LoginForm() {
  const INITIAL_LOGIN_OBJ = {
    email: "",
    password: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    console.log(loginObj.email);

    if (loginObj.email.trim() === "")
      return setErrorMessage("Email is required! (use any value)");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required! (use any value)");
    else {
      setLoading(true);
      // Call API to check user credentials and save token in localstorage
      const token = { name: loginObj.email, role: "admin" };
      localStorage.setItem("token", JSON.stringify(token));
      setLoading(false);
      window.location.href = "/dashboard";
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginObj({ ...loginObj, [id]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-login-svg bg-cover">
      <div className="bg-white py-12 px-16 rounded-md shadow-md w-full max-w-md font-poppins">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Log in</h2>
          <span className="text-sm text-gray-600">
            Please enter your details
          </span>
        </div>
        <form onSubmit={submitForm}>
          <TextInput
            id="email"
            type="email"
            label="Email"
            value={loginObj.email}
            onChange={handleChange}
            required
          />
          <TextInput
            id="password"
            type="password"
            label="Password"
            value={loginObj.password}
            onChange={handleChange}
            required
          />
          <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
          <SingleButton
            type="submit"
            className={`w-full mt-6 border-none text-white${
              loading ? " loading" : ""
            }`}
            btnTitle="Login"
            btnBg="bg-blue-500 hover:bg-blue-600"
          />
        </form>
      </div>
    </div>
  );
}

export default LoginForm;

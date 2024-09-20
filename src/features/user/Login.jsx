import React, { useState, useEffect } from "react";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthCookies, login } from "./login";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    checkAuthCookies(setErrorMessage, navigate);
  }, [dispatch, navigate]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(creds, setErrorMessage, navigate);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCreds((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-login-svg bg-cover">
      <div className="bg-white py-12 px-16 rounded-md shadow-md w-full max-w-md font-poppins relative">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Log in</h2>
          <span className="text-sm text-gray-600">
            Please enter your details
          </span>
        </div>

        <form onSubmit={submitForm}>
          <TextInput
            id="username"
            type="text"
            label="Username"
            value={creds.username}
            onChange={handleChange}
            required
          />
          <TextInput
            id="password"
            type="password"
            label="Password"
            value={creds.password}
            onChange={handleChange}
            required
          />
          {errorMessage && (
            <Alert severity="error" className="my-4">
              {errorMessage}
            </Alert>
          )}
          <SingleButton
            type="submit"
            className="btn bg-blue-500 hover:bg-blue-600 w-full border-none text-white"
            btnTitle="Login"
          />
        </form>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;

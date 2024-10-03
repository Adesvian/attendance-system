import React, { useState, useEffect } from "react";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthCookies, login } from "../user/login-utils";

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
    <div className="flex items-center justify-center min-h-screen bg-login-svg bg-gray-100 bg-cover">
      <div className="bg-white py-12 px-12 rounded-md shadow-md w-full max-w-sm sm:max-w-md h-screen md:h-auto flex flex-col justify-center">
        <div className="mb-6 z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Login
          </h2>
          <span className="block text-sm text-gray-500 w-max">
            Selamat Datang! Silahkan login menggunakan akun anda
          </span>
        </div>

        <form onSubmit={submitForm} className="flex flex-col">
          <TextInput
            id="username"
            type="text"
            label="Username"
            value={creds.username}
            onChange={handleChange}
            className={"!bg-white"}
            required
          />
          <TextInput
            id="password"
            type="password"
            label="Password"
            value={creds.password}
            onChange={handleChange}
            className={"!bg-white"}
            required
          />
          {errorMessage && (
            <Alert severity="error" className="my-4">
              {errorMessage}
            </Alert>
          )}
          <SingleButton
            type="submit"
            className="btn bg-green-900 hover:bg-green-800 w-full border-none text-white z-10"
            btnTitle="Login"
            disabled={loading}
          />
        </form>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;

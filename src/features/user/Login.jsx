import React, { useState, useEffect } from "react";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { decodeJWT, decrypt } from "../../app/auth"; // Pastikan ini diimpor dari file auth.js

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const INITIAL_LOGIN_OBJ = {
    username: "",
    password: "",
  };
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  useEffect(() => {
    const checkAuthCookies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/get-cookies`,
          {
            withCredentials: true,
          }
        );

        const authToken = response.data._USER_AUTH_RAMADHAN;

        if (authToken) {
          try {
            // Coba dekripsi token
            const decryptedToken = decrypt(
              import.meta.env.VITE_JWT_SECRET,
              authToken
            );
            // Jika dekripsi berhasil, lakukan navigasi ke dashboard
            if (decryptedToken) {
              const role = decodeJWT(decryptedToken).role;
              if (role === "admin") {
                navigate("/dashboard-admin");
              } else if (role === "teacher") {
                navigate("/dashboard-teacher");
              } else {
                navigate("/dashboard-wali-murid");
              }
            } else {
              setErrorMessage("Something went wrong, please log in again.");
              navigate("/login");
            }
          } catch (error) {
            console.error("Invalid token decryption:", error);
            setErrorMessage("Invalid session, please log in again.");
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching cookies:", error);
        setErrorMessage("Failed to validate session, please log in again.");
      }
    };

    checkAuthCookies();
  }, [dispatch, navigate]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/login`,
        loginObj,
        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.status === 200) {
        if (response.data.role === "admin") {
          navigate("/dashboard-admin");
        } else if (response.data.role === "teacher") {
          navigate("/dashboard-teacher");
        } else {
          navigate("/dashboard-wali-murid");
        }
      } else {
        setErrorMessage("Login failed! Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginObj((prev) => ({ ...prev, [id]: value }));
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
            value={loginObj.username}
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

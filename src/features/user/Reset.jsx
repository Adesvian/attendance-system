import React, { useState } from "react";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../app/api/auth/axiosConfig";
import Swal from "sweetalert2";

function Reset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    username: "",
    nik: "",
  });
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    setTimeout(async () => {
      const isValid = await verifyData(data.username, data.nik);

      if (isValid) {
        setIsVerified(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Username atau NIK tidak valid.");
      }

      setLoading(false);
    }, 3000);
  };

  const verifyData = async (username, nik) => {
    try {
      const response = await axiosInstance.get(
        `/verify-reset?username=${username}&nid=${nik}`
      );
      return response.data.data;
    } catch (error) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setErrorMessage("Password harus minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi tidak cocok.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await axiosInstance.put(
        `/reset-password/${data.username}`,
        {
          username: data.username,
          nid: data.nik,
          password: password,
        }
      );

      if (response.data.data) {
        Swal.fire({
          title: "Success!",
          text: "Password berhasil reset.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        setErrorMessage("Gagal mengubah password.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-login-svg bg-gray-100 bg-cover">
      <div className="bg-white py-12 px-12 rounded-md shadow-md w-full lg:max-w-md h-screen lg:h-auto flex flex-col justify-center">
        <div className="mb-6 z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Reset Your Password
          </h2>
          {!isVerified ? (
            <span className="text-sm text-gray-500 w-max ">
              Masukkan username dan 3 digit terakhir NIK anda untuk verifikasi
            </span>
          ) : (
            <span className="text-sm text-gray-500 w-max">
              Masukkan password dan konfirmasi password untuk mereset password
            </span>
          )}
        </div>
        {!isVerified ? (
          <form
            onSubmit={submitForm}
            className="grid grid-cols-3 gap-x-5 lg:gap-x-2"
          >
            <div className="col-span-2">
              <TextInput
                id="username"
                type="text"
                name="username"
                label="Username"
                value={data.username}
                onChange={handleChange}
                className={"!bg-white"}
                required
              />
            </div>
            <div>
              <TextInput
                id="nik"
                type="number"
                name="nik"
                label="NIK"
                value={data.nik}
                onChange={handleChange}
                className={"!bg-white"}
                required
              />
            </div>
            {errorMessage && (
              <Alert severity="error" className="my-4 col-span-3">
                {errorMessage}
              </Alert>
            )}
            <div className="col-span-3">
              <SingleButton
                type="submit"
                className="btn bg-green-900 hover:bg-green-800 w-full border-none text-white z-10"
                btnTitle="Verify"
                disabled={loading}
              />
            </div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-md">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
          </form>
        ) : (
          <form
            onSubmit={handleSubmitPasswordChange}
            className="grid grid-cols-1 gap-2"
          >
            <TextInput
              id="password"
              type="password"
              name="password"
              label="New Password"
              value={password}
              onChange={handlePasswordChange}
              className={"!bg-white"}
              required
            />
            <TextInput
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              label="Confirmation New Password"
              value={confirmPassword}
              onChange={handlePasswordChange}
              className={"!bg-white"}
              required
            />
            {errorMessage && (
              <Alert severity="error" className="my-4 col-span-1">
                {errorMessage}
              </Alert>
            )}
            <SingleButton
              type="submit"
              className="btn bg-green-900 hover:bg-green-800 w-full border-none text-white z-10"
              btnTitle="Change Password"
              disabled={loading}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-md">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default Reset;

import axios from "axios";
import { decrypt, decodeJWT } from "../../app/api/v1/auth";

export const checkAuthCookies = async (setErrorMessage, navigate) => {
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
        const decryptedToken = decrypt(
          import.meta.env.VITE_JWT_SECRET,
          authToken
        );
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
        setErrorMessage("Invalid session, please log in again.");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  } catch (error) {
    setErrorMessage("Something wrong with the server, try again later.");
  }
};

export const login = async (creds, setErrorMessage, navigate) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/login`,
      creds,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      if (response.data.data.role === "admin") {
        navigate("/dashboard-admin");
      } else if (response.data.data.role === "teacher") {
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
  }
};

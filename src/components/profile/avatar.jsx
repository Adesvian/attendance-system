import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetAuth } from "../../redux/authSlice";
const baseURL_BE = import.meta.env.VITE_BASE_URL_BACKEND;
function Avatar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfile = () => {
    navigate("/user-profile");
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`${baseURL_BE}/logout`, {
        withCredentials: true,
      });
      dispatch(resetAuth());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="../assets/user-profile.png"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white dark:bg-base-200 rounded-box mt-3 w-52 p-2 shadow text-dark-base dark:text-dark-text"
      >
        <li>
          <a onClick={handleProfile}>Profile</a>
        </li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}

export default Avatar;

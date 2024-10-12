import { HiBars3 } from "react-icons/hi2";
import Avatar from "../components/profile/avatar";
import ToggleTheme from "../components/theme/toggleTheme";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSidebar } from "../redux/headerSlice";
import ChildSelection from "../components/selection/child-selection";
import { setChild } from "../redux/headerSlice";
import axiosInstance from "../app/api/auth/axiosConfig";

const Navbar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(window.innerWidth > 768);
  const { pageTitle } = useSelector((state) => state.header);
  const [childrenData, setChildrenData] = useState([]);
  const user = useSelector((state) => state.auth.parent);

  useEffect(() => {
    const fetchChildrenData = async () => {
      if (user) {
        try {
          const { data } = await axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/students?parent=${
              user.nid
            }`
          );
          setChildrenData(data.data);
          dispatch(setChild({ child: data.data[0] }));
        } catch (error) {
          console.error("Error fetching children data:", error);
        }
      }
    };

    fetchChildrenData();
  }, []);

  useEffect(() => {
    dispatch(setSidebar({ sidebar: open }));
  }, [open, dispatch]);

  const toggleSidebar = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className="navbar sticky top-0 shadow-md bg-gray-100 dark:bg-base-200 z-50">
      <button
        onClick={toggleSidebar}
        className=" drawer-button text-gray-800 dark:text-dark-text hover:bg-gray-400/30 p-2 rounded-md dark:hover:bg-gray-600/30"
      >
        <HiBars3 className="h-6 w-6 " />
      </button>
      <div className="flex-1">
        <h1 className="lg:text-2xl text-lg font-semibold ml-2 text-slate-800 dark:text-dark-text">
          {pageTitle}
        </h1>
      </div>
      <div className="gap-x-4 lg:pr-8">
        {user != null && (
          <>
            <ChildSelection children={childrenData} />
          </>
        )}
        <ToggleTheme />
        <Avatar />
      </div>
    </div>
  );
};

export default Navbar;

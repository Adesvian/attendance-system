import { HiBars3 } from "react-icons/hi2";
import Avatar from "../components/profile/avatar";
import Notify from "../components/notification/notification";
import ToggleTheme from "../components/theme/toggleTheme";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSidebar } from "../redux/headerSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const { pageTitle } = useSelector((state) => state.header);

  useEffect(() => {
    dispatch(setSidebar({ sidebar: open }));
  }, [open, dispatch]);

  return (
    <div className="navbar sticky top-0 shadow-md bg-gray-200 dark:bg-base-200 z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className=" drawer-button text-gray-800 dark:text-dark-text hover:bg-gray-400/30 p-2 rounded-md dark:hover:bg-gray-600/30"
      >
        <HiBars3 className="h-6 w-6 " />
      </button>
      <div className="flex-1">
        <h1 className="lg:text-2xl text-lg font-semibold ml-2 text-slate-800 dark:text-dark-text">
          {pageTitle}
        </h1>
      </div>
      <div className="gap-x-3">
        <ToggleTheme />
        <Notify />
        <Avatar />
      </div>
    </div>
  );
};

export default Navbar;

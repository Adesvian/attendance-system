import React, { cloneElement, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SidebarSubMenu from "./sidebar-submenu";
import sidebar_routes from "../routes/SidebarRoutesMenu";
import { decodeJWT } from "../app/api/auth/auth";
import { setSidebar } from "../redux/headerSlice";
import { HiXMark } from "react-icons/hi2";

function LeftSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const sideBar = useSelector((state) => state.header.sideBar);
  const user = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebar({ sidebar: false }));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && sideBar) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && !sidebar.contains(event.target)) {
          dispatch(setSidebar({ sidebar: false }));
        }
      }
    };

    // Add both mouse and touch event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Clean up both listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [sideBar, dispatch]);

  // Decode the user role safely
  let userRole = null;
  if (user) {
    try {
      userRole = decodeJWT(user).role;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // Filter sidebar routes based on user role
  const filteredRoutes = sidebar_routes.filter((menu) =>
    userRole ? menu.role.includes(userRole) : false
  );

  // Sidebar width classes
  const sidebarClasses = sideBar
    ? "lg:static lg:w-64 md:w-72 w-[17rem] absolute z-[51]" // Expanded state
    : "lg:static lg:w-20 w-0 -left-full lg:left-0"; // Collapsed state

  // Image and title classes
  const imageClasses = sideBar
    ? "rotate-[360deg] w-24 md:w-32 lg:w-1/2"
    : "w-12 lg:w-16";
  const titleClasses = sideBar ? "block" : "hidden";

  // Link container and icon classes
  const linkContainerClasses = `flex items-center gap-x-3 rounded-md whitespace-nowrap ${
    sideBar ? "p-3 md:p-4" : "p-2 lg:p-3 justify-center"
  }`;

  return (
    <>
      {sideBar && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[51] transition-opacity"
          onClick={() => dispatch(setSidebar({ sidebar: false }))}
        />
      )}
      <div
        className={`${sidebarClasses} h-screen overflow-y-auto duration-300 bg-gray-100 dark:bg-base-200 drop-shadow-md`}
      >
        <div className="p-2">
          <div className="flex flex-col items-center">
            <button
              onClick={() => dispatch(setSidebar({ sidebar: false }))}
              className="lg:hidden absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-800"
            >
              <HiXMark className="w-8 h-8" />
            </button>
            <img
              src="/attendance-system/assets/school-logo-background.png"
              className={`cursor-pointer duration-300 ${imageClasses} `}
              alt="Sidebar Logo"
            />
            <h1
              className={`text-dark-base dark:text-dark-text text-center mt-2 font-medium text-xl ${titleClasses}`}
            ></h1>
          </div>

          <ul>
            {filteredRoutes.map((menu, index) => {
              const active =
                location.pathname === menu.path ||
                (location.pathname.startsWith(menu.path) && menu.path !== "");
              return (
                <li
                  key={index}
                  className={`rounded-md text-base-200 dark:text-dark-text text-sm mt-2 ${
                    sideBar ? "" : "lg:block hidden"
                  } ${active ? "bg-gray-200 dark:bg-gray-200 text-black" : ""}`}
                >
                  {menu.submenu ? (
                    <SidebarSubMenu {...menu} />
                  ) : (
                    <NavLink
                      end
                      to={menu.path}
                      className={
                        active
                          ? "bg-gray-200 text-black font-semibold"
                          : "font-normal"
                      }
                    >
                      <div
                        className={`${linkContainerClasses} hover:bg-gray-200 hover:text-black`}
                      >
                        {cloneElement(menu.icon, {
                          className: `flex-shrink-0  ${
                            sideBar
                              ? "w-6 h-6 md:w-6 md:h-6"
                              : "w-6 h-6 lg:w-8 lg:h-8"
                          }`,
                        })}
                        <span className={`${sideBar ? "" : "hidden"}`}>
                          {menu.name}
                        </span>
                      </div>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default LeftSidebar;

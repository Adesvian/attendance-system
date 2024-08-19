import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SidebarSubMenu from "./sidebar-submenu";
import sidebar_routes from "../routes/sidebar-menu-routes";
import React, { cloneElement } from "react";

function LeftSidebar() {
  const location = useLocation();
  const sideBar = useSelector((state) => state.header.sideBar);

  // Sidebar width classes
  const sidebarClasses = sideBar
    ? "lg:w-72 w-fit" // Expanded on desktop and mobile
    : "lg:w-24 w-0"; // Collapsed on desktop, hidden on mobile

  // Image and title classes
  const imageClasses = sideBar ? "rotate-[360deg] w-1/2" : "w-full";
  const titleClasses = sideBar ? "" : "hidden";

  // Link container and icon classes
  const linkContainerClasses = `flex items-center gap-x-3 rounded-md ${
    sideBar ? "p-3" : "p-1.5 justify-center tooltip tooltip-right"
  }`;

  return (
    <div
      className={`${sidebarClasses} min-h-screen duration-300 bg-gray-200 dark:bg-base-200 drop-shadow-md `}
    >
      <div className="p-2">
        <div className="flex flex-col items-center">
          <img
            src="https://fingerspot-dev.s3.ap-southeast-1.amazonaws.com/fingerspot-dev/landing/1/1/content_features/5_20200309093631_rRctc2xU.png"
            className={`cursor-pointer duration-300 ${imageClasses} ${
              sideBar ? "drop-shadow-[-10px_-3px_0px_rgba(0,0,0,0.7)]" : ""
            }`}
            alt="Sidebar Logo"
          />
          <h1
            className={`text-dark-base dark:text-dark-text text-center mt-2 font-medium text-xl ${titleClasses}`}
          >
            none
          </h1>
        </div>

        <ul>
          {sidebar_routes.map((menu, index) => {
            return (
              <li
                key={index}
                className={`rounded-md text-base-200 dark:text-dark-text text-sm mt-2 ${
                  sideBar ? "" : "lg:block hidden"
                } ${
                  location.pathname === menu.path
                    ? "bg-gray-300 dark:bg-gray-200 text-black"
                    : ""
                }`}
              >
                {menu.submenu ? (
                  <SidebarSubMenu {...menu} />
                ) : (
                  <NavLink
                    end
                    to={menu.path}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-gray-200  text-black font-semibold"
                        : "font-normal"
                    }
                  >
                    <div
                      className={`${linkContainerClasses} hover:bg-gray-300 hover:text-black`}
                      data-tip={menu.name}
                    >
                      {cloneElement(menu.icon, {
                        className: `flex-shrink-0 ${
                          sideBar ? "w-6 h-6" : "w-8 h-8"
                        } `,
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
  );
}

export default LeftSidebar;

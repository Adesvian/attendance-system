import { cloneElement, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useSelector } from "react-redux";

function SidebarSubMenu({ submenu, name, icon }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { sideBar } = useSelector((state) => state.header);

  useEffect(() => {
    const isCurrentPath = submenu.some((m) => m.path === location.pathname);
    setIsExpanded(isCurrentPath);
  }, []);

  const handleToggle = () => setIsExpanded((prev) => !prev);

  const iconSize = "w-6 h-6";
  const containerClasses = `flex items-center gap-x-3 duration-300 min-w-0 ${
    sideBar ? "p-3 flex-1" : "p-1.5"
  }`;

  // Two lines dengan text wrap
  const textClassesTwoLines = `transition-transform duration-300 leading-tight ${
    sideBar
      ? "max-w-[6rem] lg:max-w-full opacity-100 whitespace-normal line-clamp-2"
      : "w-0 opacity-0 hidden"
  }`;

  const baseClasses = "w-6 h-6 transition-transform duration-300";
  const chevronClasses = `${baseClasses} -rotate-${!isExpanded ? "90" : "0"} ${
    sideBar ? "ml-0" : "ml-5"
  }`;

  // Pilih salah satu textClasses yang ingin digunakan:
  const activeTextClasses = textClassesTwoLines;

  return (
    <>
      <div
        className={`flex items-center cursor-pointer text-base-200 dark:text-dark-text w-full ${
          sideBar ? "pr-2" : "px-2"
        }`}
        onClick={handleToggle}
      >
        <div className={containerClasses}>
          {cloneElement(icon, {
            className: `flex-shrink-0 ${iconSize}`,
          })}
          <span className={activeTextClasses}>{name}</span>
        </div>
        <div className="flex-shrink-0 ml-auto">
          <HiOutlineChevronDown className={chevronClasses} />
        </div>
      </div>

      {isExpanded && (
        <div className="w-full lg:-ml-4 mt-0">
          <ul className="relative lg:left-4 bg-gray-100 dark:bg-base-300 p-2 rounded-md">
            {submenu.map((item, index) => {
              const active =
                location.pathname === item.path ||
                (location.pathname.startsWith(item.path) && item.path !== "");
              return (
                <li
                  key={index}
                  className={`rounded-md text-base-200 dark:text-dark-text text-sm mt-2 ${
                    active ? "bg-gray-200 dark:bg-dark-text text-black" : ""
                  }`}
                >
                  <NavLink
                    end
                    to={item.path}
                    className={
                      active
                        ? "bg-gray-200 text-black text-sm font-semibold whitespace-nowrap"
                        : "font-normal whitespace-nowrap"
                    }
                  >
                    <div className="flex items-center gap-x-3 p-3 hover:text-black dark:hover:bg-dark-text hover:bg-gray-200 rounded-md">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {cloneElement(item.icon, { className: iconSize })}
                      </div>
                      <span className={`${sideBar ? "" : "hidden"}`}>
                        {item.name}
                      </span>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default SidebarSubMenu;

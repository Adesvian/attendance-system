import { cloneElement, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useSelector } from "react-redux";

function SidebarSubMenu({ submenu, name, icon }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { sideBar } = useSelector((state) => state.header);
  // Determine if the submenu should be expanded based on the current path
  useEffect(() => {
    const isCurrentPath = submenu.some((m) => m.path === location.pathname);
    setIsExpanded(isCurrentPath);
  }, []);

  // Toggle submenu visibility
  const handleToggle = () => setIsExpanded((prev) => !prev);

  // Determine icon size based on sidebar state
  const iconSize = sideBar ? "w-6 h-6" : "w-8 h-8";
  const containerClasses = `flex flex-1 items-center gap-x-3 duration-300 ${
    sideBar ? "p-3" : "p-1.5"
  }`;
  const textClasses = `transition-transform duration-300 overflow-hidden  ${
    sideBar ? "max-w-[10rem] opacity-100" : "max-w-0 opacity-0"
  }`;
  const chevronClasses = `w-6 h-6 -translate-x-3 duration-300 transition-transform ${
    sideBar
      ? isExpanded
        ? "rotate-180"
        : ""
      : isExpanded
      ? "rotate-0"
      : "-rotate-90"
  } ${sideBar ? "" : "-ml-2.5"}`;

  const linkContainerClasses = `flex items-center gap-x-3 rounded-md ${
    sideBar ? "p-3" : "p-1.5 justify-center"
  }`;

  return (
    <>
      <div
        className={`flex items-center cursor-pointer text-base-200 dark:text-dark-text ${
          sideBar ? "justify-start" : ""
        }`}
        onClick={handleToggle}
      >
        <div className={containerClasses}>
          {cloneElement(icon, { className: `flex-shrink-0 ${iconSize}` })}
          <span className={textClasses}>{name}</span>
        </div>
        <HiOutlineChevronDown className={chevronClasses} />
      </div>

      {isExpanded && (
        <div className="w-full lg:-ml-4 mt-2">
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
                        ? "bg-gray-200 text-black text-sm font-semibold"
                        : "font-normal"
                    }
                  >
                    <div
                      className={`${linkContainerClasses} hover:text-black dark:hover:bg-dark-text hover:bg-gray-200 p-3`}
                    >
                      {item.icon}
                      <span className={`${sideBar ? "" : "hidden"} `}>
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

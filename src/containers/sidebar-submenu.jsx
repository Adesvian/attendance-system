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
  }, [submenu, location.pathname]);

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
    sideBar ? "p-3" : "p-1.5 justify-center tooltip tooltip-right"
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
        <div className="w-fit mt-2">
          <ul className="relative lg:left-4">
            {submenu.map((item, index) => (
              <li
                key={index}
                className={`rounded-md  text-base-200 dark:text-dark-text text-sm mt-2 ${
                  location.pathname === item.path
                    ? "bg-gray-300 text-black"
                    : ""
                }`}
              >
                <NavLink
                  end
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-gray-200  text-black font-semibold"
                      : "font-normal"
                  }
                >
                  <div
                    className={`${linkContainerClasses} hover:text-black hover:bg-gray-300 p-3`}
                    data-tip={item.name}
                  >
                    {item.icon}
                    <span className={`${sideBar ? "" : "hidden"} `}>
                      {item.name}
                    </span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default SidebarSubMenu;

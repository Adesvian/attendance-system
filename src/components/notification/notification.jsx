import React from "react";
import { HiOutlineBell } from "react-icons/hi";
function Notify() {
  return (
    <button className="btn btn-ghost btn-circle">
      <div className="indicator">
        <HiOutlineBell className="h-6 w-6 text-gray-700 dark:text-dark-text stroke-1 " />
        <span className="indicator-item badge badge-secondary badge-sm">
          16
        </span>
      </div>
    </button>
  );
}

export default Notify;

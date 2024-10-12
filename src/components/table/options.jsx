import React from "react";
import { BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

const OptionMenu = ({ row, onEdit, onDelete }) => {
  return (
    <div className="dropdown dropdown-left">
      <div tabIndex={0} className="action">
        <BsThreeDotsVertical />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-white rounded-box w-fit p-1 -mt-2 shadow"
      >
        <li>
          <a
            onClick={() => onDelete(row.id)}
            className="text-red-500 cursor-pointer"
          >
            <BsTrash />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default OptionMenu;

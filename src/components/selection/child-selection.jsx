import React from "react";
import SingleButton from "../button/Button";
import { useDispatch } from "react-redux";
import { setChild } from "../../redux/headerSlice";

function ChildSelection({ children }) {
  const dispatch = useDispatch();
  const handleChange = (child) => {
    dispatch(setChild({ child }));
  };

  return (
    <div className="dropdown dropdown-end">
      <SingleButton
        btnTitle="Pilih Anak"
        className={"bg-white h-9 drop-shadow-md rounded-md text-dark-base"}
      />
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white dark:bg-base-200 rounded-box mt-5 w-52 p-2 shadow text-dark-base dark:text-dark-text gap-y-2"
      >
        {children.map((child, index) => (
          <div key={index} className="flex gap-x-2">
            <input
              type="radio"
              name="radio-children"
              className="radio radio-sm checked:bg-[#fafafa]"
              id={`child-${index}`}
              defaultChecked={index === 0}
              onChange={() => handleChange(child)}
            />
            <label htmlFor={`child-${index}`}>{child.name}</label>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ChildSelection;

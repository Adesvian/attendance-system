import React from "react";

function SingleButton({ btnTitle, btnBg, onClick }) {
  return (
    <button className={`btn border-none  ${btnBg}`} onClick={onClick}>
      {btnTitle}
    </button>
  );
}

export default SingleButton;

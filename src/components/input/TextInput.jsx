import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function TextInput({
  id,
  name,
  type,
  label,
  value = "",
  onChange,
  className,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="relative mb-4">
      <input
        id={id}
        name={name}
        type={showPassword && type === "password" ? "text" : type}
        placeholder={label}
        value={value}
        onChange={onChange}
        className={`input input-bordered w-full bg-white text-gray-900 ${className}`}
        required={required}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
}

export default TextInput;

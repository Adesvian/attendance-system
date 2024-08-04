import React from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

function FloatInput({ id, type, label, value, onChange, required }) {
  return (
    <div>
      <FloatLabel>
        <InputText
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="p-3 bg-transparent border border-gray-400 rounded-md "
        />
        <label
          for={label}
          className="absolute left-2 transition-all text-gray-500"
        >
          {label}
        </label>
      </FloatLabel>
    </div>
  );
}

export default FloatInput;

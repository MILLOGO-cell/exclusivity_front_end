import React, { useState } from "react";

const CustomInput = ({ label, value, onChange, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`custom-input ${isFocused ? "focused" : ""}`}>
      <label className="custom-label" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="input-style"
      />
      <style jsx>
        {`
          .custom-input {
            position: relative;
            margin-bottom: 16px;
          }

          .custom-label {
            position: absolute;
            top: 0;
            left: 0;
            transition: all 0.2s ease;
            pointer-events: none;
          }

          .custom-input input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 25px;
            font-size: 16px;
          }

          .custom-input.focused .custom-label {
            transform: translateY(-100%) scale(0.8);
            font-size: 12px;
            color: #333;
          }
          input-style {
            margin-left: 12px;
          }
        `}
      </style>
    </div>
  );
};

export default CustomInput;

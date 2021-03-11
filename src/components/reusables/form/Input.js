import React from "react";

const Input = ({ label, type, placeholder = "記入してください", autoComplete }) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="form-label" htmlFor={type}>
          {label}
        </label>
      )}
      <input
        className="form-input shadow"
        type={type}
        name={type + "-form"}
        id={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default Input;

import React from "react";

const Input = ({
  label,
  type,
  required = true,
  placeholder = "記入してください",
  autoComplete,
  inputRef,
}) => {
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
        required={required}
        name={type + "-form"}
        id={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        ref={inputRef}
      />
    </div>
  );
};

export default Input;

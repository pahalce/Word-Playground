import React from "react";

const Input = ({
  id,
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
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className="form-input shadow"
        type={type}
        required={required}
        name={id + "-form"}
        id={id}
        placeholder={placeholder}
        autoComplete={autoComplete}
        ref={inputRef}
      />
    </div>
  );
};

export default Input;

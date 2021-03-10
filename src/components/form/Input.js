import React from "react";

const Input = ({ label, type, placeholder = "記入してください" }) => {
  return (
    <div className="input-wrapper">
      <label className="form-label" htmlFor={type}>
        {label}
      </label>
      <input className="form-input" type={type} name={type + "-form"} id={type} placeholder={placeholder} />
    </div>
  );
};

export default Input;

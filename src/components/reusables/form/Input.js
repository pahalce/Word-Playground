import React from "react";

const Input = ({ id, label, inputRef, ...rest }) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input className="form-input shadow" name={id + "-form"} id={id} ref={inputRef} {...rest} />
    </div>
  );
};

export default Input;

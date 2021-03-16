import React from "react";

const Alert = ({ msg, type = "danger" }) => {
  return <div className={"alert " + type}>{msg}</div>;
};

export default Alert;

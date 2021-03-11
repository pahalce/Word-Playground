import React from "react";

const BtnIcon = ({ icon, size = "2em" }) => {
  return (
    <div className="btn-icon shadow" style={{ fontSize: size }}>
      {icon()}
    </div>
  );
};

export default BtnIcon;

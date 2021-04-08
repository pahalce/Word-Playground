import React from "react";

const BtnIcon = ({ icon, size = "2em", onClick }) => {
  return (
    <div
      className="btn-icon shadow"
      style={{ fontSize: size }}
      onClick={onClick}
    >
      {icon()}
    </div>
  );
};

export default BtnIcon;

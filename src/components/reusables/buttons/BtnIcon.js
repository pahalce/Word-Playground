import React, { useState } from "react";

const BtnIcon = ({ icon, size = "2em", onClick }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={"btn-icon shadow" + (selected ? " selected" : "")}
      style={{ fontSize: size }}
      onClick={() => {
        setSelected((setSelected) => !setSelected);
        onClick();
      }}
    >
      {icon()}
    </div>
  );
};

export default BtnIcon;

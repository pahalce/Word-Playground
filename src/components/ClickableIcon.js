import React, { useState } from "react";

const ClickableIcon = ({ before, after, size }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div
      className="icon"
      style={{ fontSize: size + "em" }}
      onClick={() => {
        setClicked(!clicked);
      }}
    >
      {!clicked && before()}
      {clicked && <div className="icon-after">{after()}</div>}
    </div>
  );
};

export default ClickableIcon;

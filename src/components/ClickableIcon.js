import React, { useState } from "react";

const ClickableIcon = ({ before, after }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div
      className="icon"
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

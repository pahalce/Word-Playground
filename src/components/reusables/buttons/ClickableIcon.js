import { useEffect, useState } from "react";

const ClickableIcon = ({ before, after, size, selected }) => {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    setClicked(selected)
  }, [selected])

  return (
    <div
      className="clickable-icon"
      style={{ fontSize: size + "em" }}
      onClick={() => {
        setClicked(!clicked);
      }}
    >
      {!clicked && before()}
      {clicked && <div className="clickable-icon-after">{after()}</div>}
    </div>
  );
};

export default ClickableIcon;

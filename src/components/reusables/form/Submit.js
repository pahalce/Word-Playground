import React from "react";

const Submit = () => {
  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="submit-wrapper">
      <input className="btn-submit shadow" type="submit" value="送信" onClick={handleClick} />
    </div>
  );
};

export default Submit;

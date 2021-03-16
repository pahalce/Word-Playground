import React from "react";

const Submit = ({ onClick = () => {} }) => {
  return (
    <div className="submit-wrapper">
      <input className="btn-submit shadow" type="submit" value="送信" onClick={onClick} />
    </div>
  );
};

export default Submit;

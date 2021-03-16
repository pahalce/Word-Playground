import React from "react";

const Submit = (props) => {
  return (
    <div className="submit-wrapper">
      <input className="btn-submit shadow" type="submit" value="送信" {...props} />
    </div>
  );
};

export default Submit;

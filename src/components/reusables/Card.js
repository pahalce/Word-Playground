import React from "react";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import ClickableIcon from "./ClickableIcon";

const Card = ({ title, content }) => {
  return (
    <div className="card">
      <div className="card-banner">{title}</div>
      <div className="card-content">
        <div className="card-content-text">{content}</div>
        <div className="card-content-bottom">
          <ClickableIcon before={BsHeart} after={BsFillHeartFill} size={"1.4"} />
        </div>
      </div>
    </div>
  );
};

export default Card;

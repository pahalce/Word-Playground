import React from "react";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import ClickableIcon from "./ClickableIcon";
import { RiUserStarLine as OwnerIcon } from "react-icons/ri";

const Card = ({ title, content, bottomText, width, height, fontSize, isOwner }) => {
  return (
    <div className="card shadow" style={{ width: width, height: height, fontSize: fontSize }}>
      <div className="card-banner">
        {isOwner && <OwnerIcon className="card-banner-icon" />}
        <div>{title}</div>
      </div>
      <div className="card-content">
        <div className="card-content-text">{content}</div>
        <div className="card-content-bottom">
          {bottomText}
          <ClickableIcon before={BsHeart} after={BsFillHeartFill} size={"1.4"} />
        </div>
      </div>
    </div>
  );
};

export default Card;

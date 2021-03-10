import React from "react";
import Card from "./Card";
import ClickableIcon from "./ClickableIcon";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";

const MainPage = () => {
  return (
    <div className="main-page">
      <h1 className="main-title text-primary">朝までそれ正解</h1>
      <div className="card">
        <div className="card-banner">ルール</div>
        <div className="card-content">
          <div className="card-content-text">お題に沿って答えよう</div>
          <div className="card-content-bottom">
            オッケーならクリック→
            <ClickableIcon before={BsHeart} after={BsFillHeartFill} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

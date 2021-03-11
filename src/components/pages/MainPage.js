import React from "react";
import ClickableIcon from "../reusables/ClickableIcon";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";

const MainPage = () => {
  return (
    <div className="main-page">
      <h1 className="text-title">朝までそれ正解</h1>
      <div className="card">
        <div className="card-banner">ルール</div>
        <div className="card-content">
          <div className="card-content-text">お題に沿って答えよう</div>
          <div className="card-content-bottom">
            オッケーならクリック→
            <ClickableIcon before={BsHeart} after={BsFillHeartFill} size={"1.4"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

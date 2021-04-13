import React from "react";
import Card from "../reusables/Card";

const MainPage = () => {
  return (
    <div className="main-page">
      <h1 className="text-title">朝までそれ正解</h1>
      <Card title="ルール" content="お題に沿って答えよう" bottomText="オッケーならクリック→" />
    </div>
  );
};

export default MainPage;

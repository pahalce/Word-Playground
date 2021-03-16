import React from "react";
import Card from "../reusables/Card";
import { useAuth } from "../../contexts/AuthContext";

const MainPage = () => {
  const { currentUser } = useAuth();
  return (
    <div className="main-page">
      <h1 className="text-title">朝までそれ正解</h1>
      <Card title="ルール" content="お題に沿って答えよう" bottomText="オッケーならクリック→" />
      {currentUser.email}
    </div>
  );
};

export default MainPage;

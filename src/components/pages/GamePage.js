import React from "react";
import Card from "../reusables/Card";

const GamePage = ({ letter, adj }) => {
  return (
    <div className="gamepage">
      <div className="theme">
        <span>{letter}</span>
        からはじまる
        <span>{adj}</span>
        言葉
      </div>
      <div className="gamepage-board">
        <Card title="山田　太郎" content="考え中" />
      </div>
    </div>
  );
};

export default GamePage;

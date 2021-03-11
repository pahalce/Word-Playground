import React from "react";
import Card from "../reusables/Card";

const GamePage = ({ letter, adj }) => {
  return (
    <div className="gamepage">
      <div className="gamepage-theme">
        <span>{letter}</span>
        からはじまる
        <span>{adj}</span>
        言葉
      </div>
      <div className="gamepage-board ">
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
      </div>
      aaa
    </div>
  );
};

export default GamePage;

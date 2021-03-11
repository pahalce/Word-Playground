import React from "react";
import Card from "../reusables/Card";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import BtnIcon from "../reusables/BtnIcon";
import { MdInsertEmoticon, MdSettings } from "react-icons/md";

const GamePage = ({ letter, adj }) => {
  return (
    <div className="gamepage">
      <div className="gamepage-theme">
        <span>{letter}</span>
        からはじまる
        <span>{adj}</span>
        言葉
      </div>
      <div className="gamepage-board shadow">
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
        <Card title="山田　太郎" content="考え中..." width="24vw" height="24vh" fontSize="1.4em" />
      </div>
      <div className="gamepage-controller">
        <Input type="txt" placeholder="回答を記入してください" />
        <Submit />
        <BtnIcon icon={MdInsertEmoticon} size="2.25em" />
        <BtnIcon icon={MdSettings} size="2.25em" />
      </div>
    </div>
  );
};

export default GamePage;

import React from "react";
import Input from "./Input";
import Submit from "./Submit";

const Signup = () => {
  return (
    <div className="signup">
      <h1 className="text-title">サインアップ</h1>
      <form>
        <Input label="Eメール:" type="email" />
        <Input label="パスワード:" type="password" />
        <Input label="ニックネーム:" type="text" />
        <Submit />
      </form>
    </div>
  );
};

export default Signup;

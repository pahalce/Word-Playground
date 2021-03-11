import React from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";

const Signup = () => {
  return (
    <div className="signup">
      <h1 className="text-title">サインアップ</h1>
      <form>
        <Input label="Eメール:" type="email" autoComplete="email" />
        <Input label="パスワード:" type="password" autoComplete="new-password" />
        <Input label="ニックネーム:" type="text" autoComplete="username" />
        <Submit />
      </form>
    </div>
  );
};

export default Signup;

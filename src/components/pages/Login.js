import React from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
const Login = () => {
  return (
    <div className="login">
      <h1 className="text-title">ログイン</h1>
      <form>
        <Input id="email" label="Eメール:" type="email" autoComplete="email" />
        <Input id="password" label="パスワード:" type="password" autoComplete="current-password" />
        <Submit />
      </form>
    </div>
  );
};

export default Login;

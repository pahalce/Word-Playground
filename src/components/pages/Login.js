import React from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
const Login = () => {
  return (
    <div className="signup">
      <h1 className="text-title">ログイン</h1>
      <form>
        <Input label="Eメール:" type="email" autoComplete="email" />
        <Input label="パスワード:" type="password" autoComplete="current-password" />
        <Submit />
      </form>
    </div>
  );
};

export default Login;

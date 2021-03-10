import React from "react";
import Input from "./Input";
import Submit from "./Submit";
const Login = () => {
  return (
    <div className="signup">
      <h1 className="text-title">ログイン</h1>
      <form>
        <Input label="Eメール:" type="email" />
        <Input label="パスワード:" type="password" />
        <Submit />
      </form>
    </div>
  );
};

export default Login;

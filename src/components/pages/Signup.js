import React, { useRef } from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import { useAuth } from "../../contexts/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nicknameRef = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signup">
      <h1 className="text-title">サインアップ</h1>
      <form onSubmit={handleSubmit}>
        <Input label="Eメール:" type="email" autoComplete="email" inputRef={emailRef} />
        <Input label="パスワード:" type="password" autoComplete="new-password" inputRef={passwordRef} />
        <Input label="ニックネーム:" type="text" autoComplete="username" inputRef={nicknameRef} />
        <Submit />
      </form>
    </div>
  );
};

export default Signup;

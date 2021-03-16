import React, { useRef, useState } from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../reusables/Alert";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const usernameRef = useRef("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value);

      setLoading(false);
      history.push("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      <h1 className="text-title">サインアップ</h1>
      <form onSubmit={handleSubmit}>
        <Alert msg={error} />
        <Input
          label="Eメール:"
          id="email"
          type="email"
          required={true}
          placeholder="記入してください"
          autoComplete="email"
          inputRef={emailRef}
        />
        <Input
          label="パスワード:"
          id="password"
          type="password"
          required={true}
          placeholder="記入してください"
          autoComplete="new-password"
          inputRef={passwordRef}
        />
        <Input
          label="パスワード(確認用):"
          id="password-comfirm"
          type="password"
          required={true}
          placeholder="記入してください"
          autoComplete="new-password"
          inputRef={passwordConfirmRef}
        />
        <Input
          id="username"
          label="ニックネーム:"
          type="text"
          required={true}
          placeholder="記入してください"
          autoComplete="username"
          inputRef={usernameRef}
        />
        <Submit disabled={loading} />
      </form>
    </div>
  );
};

export default Signup;

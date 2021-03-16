import React, { useRef, useState } from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../reusables/Alert";
import { useHistory } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h1 className="text-title">ログイン</h1>
      <form onSubmit={handleSubmit}>
        <Alert msg={error} />
        <Input
          label="Eメール:"
          id="email"
          type="email"
          placeholder="記入してください"
          autoComplete="email"
          inputRef={emailRef}
        />
        <Input
          label="パスワード:"
          id="password"
          type="password"
          placeholder="記入してください"
          autoComplete="new-password"
          inputRef={passwordRef}
        />

        <Submit disabled={loading} />
      </form>
    </div>
  );
};

export default Login;

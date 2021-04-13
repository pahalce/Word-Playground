import { useRef, useState } from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../reusables/Alert";
import { Link, useHistory } from "react-router-dom";

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
        <div className="form-bottom-text">
          <Link to="/forgot-password" className="link link-text">
            パスワードを忘れた！
          </Link>
        </div>
        <Submit disabled={loading} />
      </form>
    </div>
  );
};

export default Login;

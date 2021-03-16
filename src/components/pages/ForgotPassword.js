import React, { useRef, useState } from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../reusables/Alert";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const emailRef = useRef("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("パスワード再設定用のメールを送信しました");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <h1 className="text-title">パスワードリセット</h1>
      <form onSubmit={handleSubmit}>
        <Alert msg={error ? error : message} type={error ? "danger" : "success"} />
        <Input
          label="Eメール:"
          id="email"
          type="email"
          required={true}
          placeholder="記入してください"
          autoComplete="email"
          inputRef={emailRef}
        />
        <div className="form-buttom-text">
          <Link to="/login" className="link">
            ログイン
          </Link>
        </div>
        <Submit disabled={loading} />
      </form>
    </div>
  );
};

export default ForgotPassword;

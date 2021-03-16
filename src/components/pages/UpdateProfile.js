import React, { useRef, useState } from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../reusables/Alert";
import { useHistory } from "react-router-dom";

const UpdateProfile = () => {
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const nicknameRef = useRef("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("passwords do not match");
    }

    const promises = [];
    setError("");
    setMessage("");
    setLoading(true);
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }
    if (promises.length === 0) {
      setLoading(false);
      setError("アカウント情報を更新してください");
      return;
    }

    Promise.all(promises)
      .then(() => {
        setMessage("アカウント情報を更新しました");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="signup">
      <h1 className="text-title">プロフィール更新</h1>
      <form onSubmit={handleSubmit}>
        <Alert msg={error ? error : message} type={error ? "danger" : "success"} />

        <Input
          label="Eメール:"
          id="email"
          type="email"
          required={true}
          defaultValue={currentUser.email}
          placeholder="記入してください"
          autoComplete="email"
          inputRef={emailRef}
        />
        <Input
          label="パスワード:"
          id="password"
          type="password"
          placeholder="変更しないなら空欄"
          autoComplete="new-password"
          inputRef={passwordRef}
        />
        <Input
          label="パスワード(確認用):"
          id="password-comfirm"
          type="password"
          placeholder="変更しないなら空欄"
          autoComplete="new-password"
          inputRef={passwordConfirmRef}
        />
        <Input
          id="nickname"
          label="ニックネーム:"
          type="text"
          placeholder="変更しないなら空欄"
          autoComplete="username"
          inputRef={nicknameRef}
        />
        <Submit disabled={loading} />
      </form>
    </div>
  );
};

export default UpdateProfile;

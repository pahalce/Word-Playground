import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const handleLogout = async () => {
    try {
      await logout();
      window.alert("logged out");
      history.push("/login");
    } catch {
      window.alert("failed to logout");
    }
  };
  return (
    <div className="header">
      <div className="header-container">
        <Link to="/" className="title link">
          Word Playground
        </Link>
        <ul className="nav">
          {currentUser && (
            <Link to="/gamepage" className="nav-item link">
              ゲーム
            </Link>
          )}
          {currentUser && <li className="nav-item">ルーム作成</li>}
          {currentUser && (
            <Link to="/profile" className="nav-item link">
              プロフィール
            </Link>
          )}
          {!currentUser && (
            <Link to="/login" className="nav-item link">
              ログイン
            </Link>
          )}
          {!currentUser && (
            <Link to="/signup" className="nav-item link">
              サインアップ
            </Link>
          )}
          {currentUser && (
            <li className="nav-item" onClick={handleLogout}>
              ログアウト
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

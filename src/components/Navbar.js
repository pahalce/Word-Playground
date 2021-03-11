import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <div className="header">
      <div className="header-container">
        <Link to="/" className="title link">
          Word Playground
        </Link>
        <ul className="nav">
          <Link to="/gamepage" className="nav-item link">
            ゲーム
          </Link>
          {user && <li className="nav-item">ルーム作成</li>}
          {user && <li className="nav-item">プロフィール</li>}
          <Link to="/login" className="nav-item link">
            ログイン
          </Link>
          <Link to="/signup" className="nav-item link">
            サインアップ
          </Link>
          {user && <li className="nav-item">ログアウト</li>}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

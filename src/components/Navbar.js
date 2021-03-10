import React from "react";

const Navbar = ({ user }) => {
  return (
    <div className="header">
      <div className="header-container">
        <h1 className="title">Word Playground</h1>
        <ul className="nav">
          {user && <li className="nav-item">ルーム作成</li>}
          {user && <li className="nav-item">プロフィール</li>}
          <li className="nav-item">ログイン</li>
          <li className="nav-item">サインアップ</li>
          {user && <li className="nav-item">ログアウト</li>}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

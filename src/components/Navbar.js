import React from "react";

const Navbar = ({ user }) => {
  return (
    <div className="header">
      <div className="header-container">
        <div className="title">Word Playground</div>
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

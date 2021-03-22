import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

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
          {currentUser && location.pathname.split("/")[1] !== "gamepage" && (
            <Link to="/rooms" className="nav-item link">
              ルーム
            </Link>
          )}
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
          {currentUser && location.pathname.split("/")[1] !== "gamepage" && (
            <li className="nav-item" onClick={handleLogout}>
              ログアウト
            </li>
          )}
          {currentUser && location.pathname.split("/")[1] === "gamepage" && (
            <Link to="/rooms" className="nav-item link">
              退出
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

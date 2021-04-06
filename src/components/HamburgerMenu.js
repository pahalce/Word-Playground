import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { slide as Menu } from "react-burger-menu";
import { toast } from "react-toastify";

const HamburgerMenu = () => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = async () => {
    if (!window.confirm("ログアウトしますか？")) {
      return;
    }
    try {
      await logout();
      toast.success("logged out");
      history.push("/login");
    } catch {
      toast.success("ログアウトしました");
    }
  };

  return (
    <Menu right width={"200"}>
      {currentUser && location.pathname.split("/")[1] !== "gamepage" && (
        <Link to="/rooms" className="nav-item link">
          ルーム
        </Link>
      )}
      {currentUser && location.pathname.split("/")[1] !== "gamepage" && (
        <Link to="/profile" className="nav-item link">
          プロフィール
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
    </Menu>
  );
};

export default HamburgerMenu;

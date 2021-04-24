import { useLocation } from "react-router";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="not-found">
      <h1>404 - Page "{location.pathname}" Not Found</h1>
      <Link to="/" className="link link-text">
        メインページへ戻る
      </Link>
    </div>
  );
};

export default NotFound;

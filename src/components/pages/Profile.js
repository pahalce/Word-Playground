import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { currentUser } = useAuth();
  return (
    <div className="profile">
      <strong>Email:</strong>
      {currentUser.email}
      <Link to="/update-profile" className="link">
        プロフィール更新
      </Link>
    </div>
  );
};

export default Profile;

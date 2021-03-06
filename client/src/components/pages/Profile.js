import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { currentUser, username } = useAuth();
  return (
    <div className="profile">
      <h1 className="text-title">プロフィール</h1>
      <p>
        <strong>Eメール:</strong>
        {currentUser.email}
      </p>
      <p>
        <strong>ユーザー名:</strong>
        {username}
      </p>
      <div className="form-bottom-text">
        <Link to="/update-profile" className="link link-text">
          プロフィール更新
        </Link>
      </div>
    </div>
  );
};

export default Profile;

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { currentUser } = useAuth();
  return (
    <div className="profile">
      <h1 className="text-title">プロフィール</h1>
      <strong>Email:</strong>
      {currentUser.email}
      <div className="form-buttom-text">
        <Link to="/update-profile" className="link link-text">
          プロフィール更新
        </Link>
      </div>
    </div>
  );
};

export default Profile;

import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = ({ component: Component, render, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <div>
      {!render && (
        <Route
          {...rest}
          render={() => {
            return currentUser ? <Component /> : <Redirect to="/login" />;
          }}
        ></Route>
      )}
      {render && (
        <Route
          {...rest}
          render={() => {
            return currentUser ? render() : <Redirect to="/login" />;
          }}
        ></Route>
      )}
    </div>
  );
};

export default PrivateRoute;

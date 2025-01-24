import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tokenVerificationApi } from "../apiUtil";
import { loginUser, logoutUser } from "../redux/user";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      <Navigate to="/authentication" />;
    }
    const verifyToken = async () => {
      const response = await tokenVerificationApi();
      if (!response.success) {
        localStorage.removeItem("token");
        dispatch(logoutUser());
        navigate("/authentication");
        setLoading(false);
      } else {
        dispatch(loginUser(response.user));
        setLoading(false);
      }
    };
    verifyToken();
  });

  if (loading) return <p>loading...</p>;
  else if (!loading) return children;
};

export default PrivateRoute;

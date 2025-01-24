import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function ProfileLayout() {
  const cart = useSelector((state) => state.cart);

  return (
    <div>
      <h2>ProfileLayout</h2>
      <Outlet />
    </div>
  );
}

export default ProfileLayout;

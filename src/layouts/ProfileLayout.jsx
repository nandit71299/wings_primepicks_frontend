import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function ProfileLayout() {
  const cart = useSelector((state) => state.cart);

  return (
    <div>
      <div className="flex justify-center shadow-lg p-4">
        <h1 className="text-3xl">Profile</h1>
      </div>
      <Outlet />
    </div>
  );
}

export default ProfileLayout;

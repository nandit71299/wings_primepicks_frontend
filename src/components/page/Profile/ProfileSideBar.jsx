import React from "react";
import { useSelector } from "react-redux";

function ProfileSideBar() {
  const cart = useSelector((state) => state.cart);
  return <div></div>;
}

export default ProfileSideBar;

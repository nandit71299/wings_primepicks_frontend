import React from "react";
import { useSelector } from "react-redux";

function ProfileSideBar() {
  const cart = useSelector((state) => state.cart);
  return (
    <div>
      <h2>{cart.products.length}</h2>
    </div>
  );
}

export default ProfileSideBar;

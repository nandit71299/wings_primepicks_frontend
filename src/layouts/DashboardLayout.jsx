import React from "react";
import { useSelector } from "react-redux";
import SellerDashboardHeader from "../components/page/Dashboard/SellerDashboardHeader";
import AdminDashboardHeader from "../components/page/Dashboard/AdminDashboardHeader";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  const role = useSelector((state) => state.user.role);

  return (
    <div>
      {role && role === "seller" ? (
        <SellerDashboardHeader />
      ) : role && role === "admin" ? (
        <AdminDashboardHeader />
      ) : (
        "Unauthorized"
      )}
      {<Outlet />}
    </div>
  );
}

export default DashboardLayout;

import React, { useState } from "react";
import AllProducts from "./AllProducts";
import AllOrders from "./AllOrders";
import AllCustomers from "./AllCustomers";
import AllDisputes from "./AllDisputes";
import Products from "./Products";
import { useSelector } from "react-redux";
import { downloadCsvReport } from "../apiUtil";
import { toast } from "react-toastify";

function Dashboard() {
  const user = useSelector((state) => state.user.user);

  const downloadCsv = async () => {
    const response = await downloadCsvReport();
    if (response.success) {
      toast.success("CSV report downloaded successfully");
    } else {
      toast.error("Failed to download CSV.");
    }
  };

  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="flex p-5 gap-5">
      <div className="flex flex-col space-y-4 border-r p-5">
        <button
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 
            ${
              activeTab === "products"
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-gray-300"
            }
            border-2 hover:bg-blue-100 hover:text-blue-700 focus:outline-none`}
          onClick={() => setActiveTab("products")}
        >
          {user.role === "admin" ? "All Platform Products" : "All Products"}
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 
            ${
              activeTab === "order-history"
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-gray-300"
            }
            border-2 hover:bg-blue-100 hover:text-blue-700 focus:outline-none`}
          onClick={() => setActiveTab("order-history")}
        >
          Order History
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 
            ${
              activeTab === "customers"
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-gray-300"
            }
            border-2 hover:bg-blue-100 hover:text-blue-700 focus:outline-none`}
          onClick={() => setActiveTab("customers")}
        >
          Customers
        </button>
        {user.role === "admin" && (
          <button
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 
            ${
              activeTab === "disputes"
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-gray-300"
            }
            border-2 hover:bg-blue-100 hover:text-blue-700 focus:outline-none`}
            onClick={() => setActiveTab("disputes")}
          >
            Disputes
          </button>
        )}
        <div>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer bg-green-500 text-white`}
            onClick={() => downloadCsv()}
          >
            Download CSV Report
          </button>
        </div>
      </div>
      <div>
        {activeTab === "products" && <Products />}
        {activeTab === "order-history" && <AllOrders />}
        {activeTab === "customers" && <AllCustomers />}
        {activeTab === "disputes" && <AllDisputes />}
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import Cart from "./Cart";
import OrderHistory from "./OrderHistory";
import { toast } from "react-toastify";
import { getOrderHistory as getOrderHistoryApi } from "../apiUtil";

function Profile() {
  const [activeTab, setActiveTab] = useState("cart");
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const getOrderHistory = async () => {
      const response = await getOrderHistoryApi();
      if (response.success) {
        setOrderHistory(response.orders);
      } else {
        toast.error(response.message || "Failed to fetch order history.");
      }
    };
    getOrderHistory();
  }, []);

  return (
    <div className="flex p-5 gap-5">
      <div className="flex flex-col space-y-4 border-r p-5">
        <button
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 
            ${
              activeTab === "cart"
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-gray-300"
            }
            border-2 hover:bg-blue-100 hover:text-blue-700 focus:outline-none`}
          onClick={() => setActiveTab("cart")}
        >
          Cart
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
      </div>

      <div>
        {activeTab === "cart" ? <Cart /> : <OrderHistory data={orderHistory} />}
      </div>
    </div>
  );
}

export default Profile;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrderHistory, updateOrderStatus } from "../apiUtil";
import { toast } from "react-toastify";
import ChangeStatusModal from "../components/page/Dashboard/Orders/ChangeStatusModal";

function AllOrders() {
  const user = useSelector((state) => state.user.user);
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchOrders, setFetchOrders] = useState(true); // Flag to trigger refetching of orders

  // Fetching orders from the API based on the role
  useEffect(() => {
    const getOrderDataFromApi = async () => {
      const response = await getOrderHistory();
      if (response.success) {
        setOrdersData(response.orders);
      } else {
        toast.error(response.message || "Cannot fetch Orders");
      }
      setFetchOrders(false); // Stop refetching once orders are loaded
    };

    if (fetchOrders) {
      getOrderDataFromApi();
    }
  }, [fetchOrders]); // Re-fetch orders only if `fetchOrders` is true

  // Open the modal to change order status
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Handle status change in an order
  const handleStatusChange = async (newStatus) => {
    const response = await updateOrderStatus({
      order_id: selectedOrder.id,
      status: newStatus,
    });
    if (response.success) {
      toast.success("Order status updated successfully!");
      setOrdersData((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setFetchOrders(true);
      closeModal();
    } else {
      toast.error(response.message || "Failed to update status");
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold mb-6">All Orders</h1>
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Order ID</th>
            <th className="px-4 py-2 text-left font-semibold">Subtotal</th>
            <th className="px-4 py-2 text-left font-semibold">Tax</th>
            <th className="px-4 py-2 text-left font-semibold">Total</th>
            <th className="px-4 py-2 text-left font-semibold">Created At</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            {user.role === "seller" && (
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {ordersData.length > 0 ? (
            ordersData.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.subtotal}</td>
                <td className="px-4 py-2">{order.tax}</td>
                <td className="px-4 py-2">{order.total}</td>
                <td className="px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      order.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                {user.role === "seller" && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(order)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Change Status
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={user.role === "seller" ? 7 : 6}
                className="px-4 py-2 text-center text-gray-500"
              >
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for changing the status */}
      {isModalOpen && selectedOrder && (
        <ChangeStatusModal
          order={selectedOrder}
          handleStatusChange={handleStatusChange}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default AllOrders;

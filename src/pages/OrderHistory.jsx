import React from "react";

function OrderHistory({ data }) {
  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Order ID</th>
            <th className="px-4 py-2 text-left font-semibold">Subtotal</th>
            <th className="px-4 py-2 text-left font-semibold">Tax</th>
            <th className="px-4 py-2 text-left font-semibold">Total</th>
            <th className="px-4 py-2 text-left font-semibold">Order Date</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((order) => (
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
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;

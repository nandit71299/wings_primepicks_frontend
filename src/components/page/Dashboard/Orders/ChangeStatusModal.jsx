import React, { useState } from "react";

function ChangeStatusModal({ order, handleStatusChange, closeModal }) {
  const [status, setStatus] = useState(order.status);

  const handleSubmit = () => {
    handleStatusChange(status);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          Change Status for Order #{order.id}
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeStatusModal;

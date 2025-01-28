import React, { useEffect, useState } from "react";
import { getAllDisputes, resolveDispute } from "../apiUtil"; // Assume resolveDispute is the function that handles the API call
import { toast } from "react-toastify";

function AllDisputes() {
  const [disputesData, setDisputesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionMessage, setResolutionMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await getAllDisputes();
      if (response.success) {
        setDisputesData(response.disputes);
      } else {
        toast.error("Failed to fetch disputes");
      }
    };
    getData();
  }, []);

  const handleResolveClick = (dispute) => {
    setSelectedDispute(dispute);
    setIsModalOpen(true);
  };

  const handleResolutionChange = (e) => {
    setResolutionMessage(e.target.value);
  };

  const handleSubmitResolution = async () => {
    if (!resolutionMessage) {
      toast.error("Please enter a resolution message");
      return;
    }

    const response = await resolveDispute({
      disputeId: selectedDispute.id,
      resolution: resolutionMessage,
    });
    if (response.success) {
      toast.success("Dispute resolved successfully");
      setIsModalOpen(false);
      setDisputesData((prev) =>
        prev.map((dispute) =>
          dispute.id === selectedDispute.id
            ? { ...dispute, resolution: resolutionMessage, status: "resolved" }
            : dispute
        )
      );
      setResolutionMessage("");
    } else {
      toast.error("Failed to resolve dispute");
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold mb-6">All Disputes</h1>
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">User ID</th>
            <th className="px-4 py-2 text-left font-semibold">Order ID</th>
            <th className="px-4 py-2 text-left font-semibold">Reason</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            <th className="px-4 py-2 text-left font-semibold">User Name</th>
            <th className="px-4 py-2 text-left font-semibold">Resolution</th>
            <th className="px-4 py-2 text-left font-semibold">Product Name</th>
            <th className="px-4 py-2 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {disputesData.length > 0 ? (
            disputesData.map((dispute) => (
              <tr key={dispute.id} className="border-t">
                <td className="px-4 py-2">{dispute.user_id}</td>
                <td className="px-4 py-2">{dispute.order_id}</td>
                <td className="px-4 py-2">{dispute.reason}</td>
                <td className="px-4 py-2">
                  <button
                    className={`px-4 py-1 rounded-lg ${
                      dispute.status === "open"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {dispute.status === "open" ? "Open" : "Resolved"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  {dispute.user.first_name} {dispute.user.last_name}
                </td>
                <td className="px-4 py-2">{dispute.resolution || "N/A"}</td>
                <td className="px-4 py-2">
                  {dispute.order.order_items[0]?.product.name || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {!dispute.resolution && dispute.status === "open" && (
                    <button
                      onClick={() => handleResolveClick(dispute)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-4 py-2 text-center text-gray-500">
                No disputes found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Resolve Dispute</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Resolution Message
              </label>
              <textarea
                value={resolutionMessage}
                onChange={handleResolutionChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitResolution}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllDisputes;

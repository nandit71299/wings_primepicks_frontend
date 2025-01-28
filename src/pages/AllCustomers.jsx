import React, { useEffect, useState } from "react";
import { getAllCustomers, deleteCustomer } from "../apiUtil"; // Assuming updateCustomerStatus is defined
import { useSelector } from "react-redux";

function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const getData = async () => {
      const response = await getAllCustomers();

      if (response.success) {
        if (user.role === "seller") {
          setCustomers((prev) => {
            const customers = response.data.map((data) => data.user);

            // Use reduce to create an array with unique customers based on id
            const uniqueCustomers = customers.reduce((acc, customer) => {
              if (!acc.find((item) => item.id === customer.id)) {
                acc.push(customer); // Add the customer if it's not already in the array
              }
              return acc;
            }, []);

            return uniqueCustomers;
          });
        } else {
          setCustomers(response.data);
        }
      }
    };
    getData();
  }, []);

  // Function to handle customer status change (Activate/Deactivate)
  const handleStatusChange = async (customerId, isActive) => {
    const action = isActive ? "deactivate" : "activate"; // Toggle between activate and deactivate
    if (window.confirm(`Are you sure you want to ${action} this customer?`)) {
      const response = await deleteCustomer({ customerId, action });
      if (response.success) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === customerId
              ? { ...customer, is_active: !isActive } // Toggle the is_active flag
              : customer
          )
        );
      } else {
        alert(`Failed to ${action} customer.`);
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold mb-6">All Customers</h1>
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">ID</th>
            <th className="px-4 py-2 text-left font-semibold">First Name</th>
            <th className="px-4 py-2 text-left font-semibold">Last Name</th>
            <th className="px-4 py-2 text-left font-semibold">Email</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            {user.role === "admin" && (
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="px-4 py-2">{customer.id}</td>
                <td className="px-4 py-2">{customer.first_name}</td>
                <td className="px-4 py-2">{customer.last_name}</td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      customer.is_active
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {customer.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                {user.role === "admin" && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() =>
                        handleStatusChange(customer.id, customer.is_active)
                      }
                      className={`text-white px-4 py-2 rounded-md ${
                        customer.is_active
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-green-500 hover:bg-green-700"
                      }`}
                    >
                      {customer.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AllCustomers;

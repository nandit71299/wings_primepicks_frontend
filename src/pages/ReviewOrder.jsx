import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrderEstimate } from "../apiUtil";
import { useNavigate } from "react-router-dom";

function ReviewOrder() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // useState to store order estimate
  const [orderEstimate, setOrderEstimate] = useState({
    products: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // Fetch order estimate
  useEffect(() => {
    if (!user?.role === "customer") {
      navigate("/");
    }
    const getData = async () => {
      const response = await getOrderEstimate();
      if (response.success) {
        setOrderEstimate((prev) => ({
          ...prev,
          products: response.products,
          subtotal: response.subtotal,
          tax: response.tax,
          total: response.total,
        }));
      } else {
        console.error(response);
      }
    };
    getData();
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6">
      {/* Conditional rendering for loading or displaying data */}
      {orderEstimate.products.length > 0 ? (
        <div className="space-y-6">
          {/* Order Title */}
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Your Order Estimate
          </h2>

          {/* Product Details */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Products
            </h3>
            {orderEstimate.products.map((product) => (
              <div key={product.id} className="flex items-center border-b py-4">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {product.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Details */}
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Pricing Details
            </h3>
            <div className="flex justify-between text-gray-700 mb-2">
              <span className="font-medium">Subtotal:</span>
              <span>${parseFloat(orderEstimate.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span className="font-medium">Tax (18%):</span>
              <span>${parseFloat(orderEstimate.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-semibold text-green-600">
                ${parseFloat(orderEstimate.total).toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  navigate("./create");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <p className="text-xl text-gray-600">
            Loading your order estimate...
          </p>
        </div>
      )}
    </div>
  );
}

export default ReviewOrder;

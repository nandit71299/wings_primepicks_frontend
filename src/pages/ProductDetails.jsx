import React from "react";
import { useLoaderData } from "react-router-dom";
import { getProductById } from "../apiUtil";

function ProductDetails() {
  // Example product data. You will replace this with actual data from the loader.
  const productData = useLoaderData();
  const { product } = productData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col flex-row bg-white shadow-lg rounded-lg">
        {/* Left side: Image */}
        <div className="p-6 w-fit">
          <img
            src={product.img}
            alt={product.name}
            className="w-[300px] h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right side: Details */}
        <div className="w-fit  p-6 flex flex-col justify-between">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
            <p className="text-xl font-bold text-gray-900 mt-4">
              ${product.price}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>

          {/* Add to Cart Button */}
          <div className="flex justify-between items-center mt-auto">
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
              Add to Cart
            </button>
            <button className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

export const loader = async ({ params }) => {
  try {
    const { id } = params;
    // Fetch product details from an API or database
    const response = await getProductById(id);
    if (!response.success) {
      throw new Error("Product not found");
    }

    return response;
  } catch (error) {
    throw new Error("Failed to load product details");
  }
};

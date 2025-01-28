import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getAllProductsByCategories } from "../../apiUtil";
import ProductCard from "../../components/ui/ProductCard";

function Home() {
  const data = useLoaderData();
  const [error, setError] = useState(null);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const products = data?.products || [];

  return (
    <div className="container mx-2 p-4 h-screen">
      {/* Fallback message if no products */}
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-center text-gray-500">
            No products found, check back later...
          </p>
        </div>
      ) : (
        <div>
          {products.map((category) => {
            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {category.name}
                </h2>
                {/* Horizontal scrollable list */}
                <div className="flex overflow-x-auto gap-4 p-2">
                  {category.Products.map((product) => {
                    return (
                      <div key={product.id} className="flex-shrink-0 w-60">
                        <ProductCard
                          product={product}
                          productUrl={`/products/${product.id}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;

export const loader = async () => {
  try {
    const data = await getAllProductsByCategories();
    if (data?.success) {
      return data; // Return the data on success
    }
    throw new Error(data?.message || "Failed to load products.");
  } catch (error) {
    console.error("Error in loader:", error.message);
    throw new Error(error.message || "Internal Server Error");
  }
};

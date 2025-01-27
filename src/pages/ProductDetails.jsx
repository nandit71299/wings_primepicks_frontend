import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { addToCart, deleteFromCart, getProductById } from "../apiUtil";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartReducer, removeFromCart } from "../redux/cart";
import { toast } from "react-toastify";

function ProductDetails() {
  const productData = useLoaderData();
  const { product } = productData;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartProducts = cart.products;
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();

    if (!user || !user.first_name) {
      toast.error("Please login to add to cart");
      navigate("/authentication");
      return;
    }

    dispatch(addToCartReducer({ productId: product.id, productData: product }));
    const response = await addToCart(product.id);
    if (response.success) {
      toast.success("Product added to cart");
    } else {
      dispatch(removeFromCart(product));
      toast.error(response.message || "Failed to add product to cart");
    }
  };

  const handleIncrease = async (productId) => {
    try {
      const response = await addToCart(productId);
      if (response.success) {
        dispatch(addToCartReducer({ productId }));
        toast.success("Product added to cart");
      } else {
        toast.error(response.message || "Failed to add product.");
      }
    } catch (error) {
      toast.error("Error adding product to cart");
    }
  };

  const handleDecrease = async (productId) => {
    try {
      const response = await deleteFromCart(productId);
      if (response.success) {
        dispatch(removeFromCart({ productId }));
        toast.success("Product removed from cart");
      } else {
        toast.error(response.message || "Failed to remove product.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error removing product from cart");
    }
  };

  const isAlreadyAdded = cartProducts.find(
    (cartProduct) => cartProduct.id === product.id
  );

  const handleAddToCart = async () => {
    try {
      dispatch(addToCartReducer(productData));
      const response = await addToCart(product.id);
      if (response.success) {
        toast.success("Product added to cart");
      } else {
        toast.error("Failed to add product to cart");
        dispatch(removeFromCart(product.id));
      }
    } catch (error) {}
  };

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
          {(user && user.role === "admin") ||
          (user && user.role === "seller") ? (
            ""
          ) : (
            <div className="text-center flex justify-center">
              {isAlreadyAdded ? (
                ""
              ) : (
                <button
                  onClick={handleAddToCartClick}
                  className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center"
                >
                  Add to cart
                </button>
              )}
              {isAlreadyAdded && (
                <div className="flex items-center mt-4">
                  <div
                    className="px-3 py-1 bg-red-500 text-white rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrease(isAlreadyAdded.id);
                    }}
                  >
                    -
                  </div>
                  <span className="mx-4 text-lg text-gray-700">
                    {isAlreadyAdded.quantity}
                  </span>
                  <div
                    className="px-3 py-1 bg-green-500 text-white rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrease(isAlreadyAdded.id);
                    }}
                  >
                    +
                  </div>
                </div>
              )}
            </div>
          )}
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

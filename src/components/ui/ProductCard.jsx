import React from "react";
import styles from "./ProductCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart, deleteFromCart } from "../../apiUtil";
import {
  addToCart as addToCartReducer,
  removeFromCart,
} from "../../redux/cart";

function ProductCard({ product, productUrl }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartProducts = cart.products;

  const handleCardClick = () => {
    navigate(`${productUrl}`);
  };

  // Find if the product is already added to the cart
  const isAlreadyAdded = cartProducts.find(
    (cartProduct) => cartProduct.id === product.id
  );

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

  return (
    <div
      key={product.id}
      className="w-full max-h-[400px] min-w-[200px] rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 flex flex-col"
      style={{ cursor: "pointer" }}
      onClick={handleCardClick}
    >
      <div className="h-108 overflow-hidden">
        <img
          className="w-full h-full object-contain"
          src={product.img}
          alt={product.name}
        />
      </div>
      <div className="flex flex-col justify-between p-4 h-full">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-gray-900">${product.price}</p>

        {(user && user.role === "admin") || (user && user.role === "seller") ? (
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
  );
}

export default ProductCard;

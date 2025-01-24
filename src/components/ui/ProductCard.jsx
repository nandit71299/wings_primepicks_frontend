import React from "react";
import styles from "./ProductCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../apiUtil";
import { decreaseQuantity, increaseQuantity } from "../../redux/cart";

function ProductCard({ product, productUrl }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    navigate(`${productUrl}`);
  };

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();

    if (!user || !user.first_name) {
      toast.error("Please login to add to cart");
      navigate("/authentication");
      return;
    }
    const response = await addToCart(product.id);
    if (response.success) {
      dispatch(increaseQuantity(product.id));
      toast.success("Product added to cart");
    } else {
      dispatch(decreaseQuantity(product.id));
      toast.error(response.message || "Failed to add product to cart");
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
          <button
            onClick={handleAddToCartClick}
            className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartReducer,
  removeFromCart,
  setCart,
} from "../redux/cart";
import { addToCart, deleteFromCart, getCartDetails } from "../apiUtil";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartData = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      user.id &&
      (!cartData.cart_id || cartData.products.length === 0)
    ) {
      const fetchCartData = async () => {
        const response = await getCartDetails(user.id);
        if (response.success) {
          dispatch(setCart(response));
        } else {
          toast.error(response.message || "Failed to fetch cart.");
        }
      };
      fetchCartData();
    }
  }, [user]);

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
      toast.error("Error removing product from cart");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      Cart Total Products {cartData.products.length}
      <div className="mt-4">
        {cartData && cartData.products.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartData?.products.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div className="flex items-center">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <p className="text-lg">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-full"
                    onClick={() => handleDecrease(item.id)}
                  >
                    -
                  </button>
                  <span className="mx-4 text-lg">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-full"
                    onClick={() => handleIncrease(item.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {cartData?.products?.length > 0 && (
          <div className="mt-2">
            <button
              className="p-3 bg-blue-500 text-white rounded-lg"
              onClick={() => navigate("/order")}
            >
              Continue to Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

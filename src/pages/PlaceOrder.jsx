import React, { useEffect } from "react";
import { createOrder } from "../apiUtil";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cart";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const create = async () => {
      const response = await createOrder();
      if (response.success) {
        navigate("/");
        dispatch(clearCart());
        toast.success("Order created successfully");
      } else {
        toast.error(response.message || "Order creation failed");
        navigate("/order");
      }
    };
    create();
  }, []);
  return (
    <div>
      <Loader />
    </div>
  );
}

export default PlaceOrder;

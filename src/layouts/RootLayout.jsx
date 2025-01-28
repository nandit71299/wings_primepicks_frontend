import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigation } from "react-router-dom";

import styles from "./RootLayout.module.css";
import Loader from "../components/ui/Loader";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/user";
import { getCartDetails } from "../apiUtil";
import { setCart } from "../redux/cart";

function RootLayout() {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && !cart?.card_id && user.role === "customer") {
      const fetchCartData = async () => {
        const response = await getCartDetails(user.id);
        if (response.success) {
          updateCart(response);
        }
      };
      fetchCartData();
    }
  }, [user]);

  const updateCart = (cartData) => {
    dispatch(setCart(cartData));
  };

  return (
    <div>
      {navigation.state === "idle" ? (
        <div>
          <div className={styles.mainContainer}>
            <div className={styles.headerContainer}>
              <div>
                <h2 className="text-3xl font-bold">
                  <Link to={"/"}>Logo</Link>
                </h2>
              </div>
              <div className={styles.linksContainer}>
                {user?.first_name ? (
                  <div>
                    <span className="font-bold">
                      Welcome {user.first_name + " " + user.last_name}{" "}
                      {`(${user.role})`}
                    </span>
                  </div>
                ) : (
                  <NavLink
                    to="/authentication"
                    className={({ isActive }) =>
                      isActive ? styles.linkActive : ""
                    }
                  >
                    Login/Signup
                  </NavLink>
                )}
                {user && (
                  <NavLink
                    to={`${
                      user.role === "admin" || user.role === "seller"
                        ? "/dashboard"
                        : "/profile"
                    }`}
                    className={({ isActive }) =>
                      isActive ? styles.linkActive : ""
                    }
                  >
                    {user.role === "admin" || user.role === "seller"
                      ? "Dashboard"
                      : "Profile"}
                  </NavLink>
                )}
                {!user || user?.role === "customer" ? (
                  <NavLink
                    end
                    to="/products"
                    className={({ isActive }) =>
                      isActive ? styles.linkActive : ""
                    }
                  >
                    All Products
                  </NavLink>
                ) : (
                  ""
                )}

                {user && (
                  <div>
                    <a
                      href="#"
                      onClick={() => {
                        localStorage.removeItem("token");
                        dispatch(logoutUser());
                        window.location.reload();
                      }}
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>

              {user && user.role === "customer" && cart ? (
                <NavLink to={"/profile"}>Cart ({cart.products.length})</NavLink>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default RootLayout;

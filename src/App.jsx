import React, { Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loader as homePageLoader } from "./pages/common/Home"; // Homepage
import { loader as productDetailsLoader } from "./pages/ProductDetails.jsx";
import { loader as allProductsLoader } from "./pages/AllProducts.jsx"; // Admin & Seller All Products
import * as Pages from "./pages/index.js";
import { ToastContainer } from "react-toastify";
import { tokenVerificationApi } from "./apiUtil.js";
import { loginUser, logoutUser } from "./redux/user.js";
import Dashboard from "./pages/Dashboard.jsx";
import ReviewOrder from "./pages/ReviewOrder.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Pages.RootLayout />,
    errorElement: <Pages.ErrorPage />,
    hydrateFallbackElement: <Pages.Loader />,
    children: [
      {
        path: "/",
        element: <Pages.Home />,
        loader: homePageLoader,
      },
      {
        path: "/products",
        element: <Pages.AllProducts />,
        loader: allProductsLoader,
        children: [
          {
            path: ":id",
            element: <Pages.ProductDetails />,
            loader: productDetailsLoader,
          },
        ],
      },

      {
        path: "/authentication",
        element: <Pages.LoginSignUp />,
      },
      {
        path: "order",
        children: [
          {
            index: true,
            element: <ReviewOrder />,
          },
          {
            path: "create",
            element: <PlaceOrder />,
          },
        ],
      },
    ],
  },

  {
    path: "dashboard",
    element: (
      <Pages.PrivateRoute>
        {/* <div className="flex"> */}
        {/* <div className="flex"> */}
        {/* <Pages.AllCustomers /> */}
        {/* </div> */}
        {/* // <div className="flex flex-col"> */}
        <Pages.DashboardLayout />
        {/* </div> */}
        {/* </div> */}
      </Pages.PrivateRoute>
    ),

    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/profile",
    element: (
      <Pages.PrivateRoute>
        {/* <div className="flex"> */}
        {/* <div className="flex"> */}
        {/* <Pages.ProfileSideBar /> */}
        {/* </div> */}
        {/* <div className="flex flex-col"> */}
        <Pages.ProfileLayout />
        {/* </div> */}
        {/* </div> */}
      </Pages.PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Pages.Profile />,
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await tokenVerificationApi();
        if (!response.success) {
          localStorage.removeItem("token");
          dispatch(logoutUser());
        } else {
          dispatch(loginUser(response.user));
        }
      }
    };

    verifyToken();
  }, []);
  return (
    <Suspense fallback={<Pages.Loader />}>
      <RouterProvider router={router} />
      <ToastContainer theme="dark" />
    </Suspense>
  );
}

export default App;
export { router };

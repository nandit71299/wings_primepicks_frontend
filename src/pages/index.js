// Common Pages
export { default as Home, loader as homePageLoader } from "./common/Home";
export { default as LoginSignUp } from "./common/LoginSignUp";

// Customer Pages
export { default as Cart } from "./Cart";
export { default as OrderHistory } from "./OrderHistory";

// Admin & Seller Pages
export { default as AllOrders } from "./AllOrders";
export {
  default as AllProducts,
  loader as allProductsLoader,
} from "./AllProducts";
export { default as AllUsers } from "./AllUsers";
export { default as AllCustomers } from "./AllCustomers";

// Product Pages
export {
  default as ProductDetails,
  loader as productDetailsLoader,
} from "./ProductDetails";

// Layouts
export { default as RootLayout } from "../layouts/RootLayout";
export { default as DashboardLayout } from "../layouts/DashboardLayout";
export { default as ProfileLayout } from "../layouts/ProfileLayout";

// Profile Components
export { default as Profile } from "./Profile";
export { default as ProfileSideBar } from "../components/page/Profile/ProfileSideBar";

// Other Components
export { default as ErrorPage } from "./ErrorPage";
export { default as PrivateRoute } from "../components/PrivateRoute";

export { default as Loader } from "../components/ui/Loader";

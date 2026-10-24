
import { Routes, Route } from "react-router-dom";

import Cart from "../pages/Cart/Cart";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import Profile from "../pages/Profile/Profile";
import Admin from "../pages/Admin/Admin";
import NotFound from "../pages/NotFound/NotFound";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

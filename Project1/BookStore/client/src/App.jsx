import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import Wishlist from './pages/Wishlist';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import OrderDetails from './pages/OrderDetails';
import MyOrders from './pages/MyOrders';
import SellerDashboard from './pages/SellerDashboard';
import SellerBookList from './pages/seller/SellerBookList';
import SellerAddBook from './pages/seller/SellerAddBook';
import SellerAddExistingBook from './pages/seller/SellerAddExistingBook';
import SellerOrders from './pages/seller/SellerOrders';
import UserList from './pages/admin/UserList';
import UserEdit from './pages/admin/UserEdit';
import BookList from './pages/admin/BookList';
import BookEdit from './pages/admin/BookEdit';
import OrderList from './pages/admin/OrderList';
import Dashboard from './pages/admin/Dashboard';
import SellerList from './pages/admin/SellerList';
import AdminSellersInventory from './pages/admin/AdminSellersInventory';
import AdminLayout from './components/AdminLayout';
import UserStatusMonitor from './components/UserStatusMonitor';
import './admin.css';

import PublicLayout from './components/PublicLayout';

function App() {
  return (
    <>
      <UserStatusMonitor />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/books" element={<SellerBookList />} />
          <Route path="/seller/add-book" element={<SellerAddBook />} />
          <Route path="/seller/add-existing-book" element={<SellerAddExistingBook />} />
          <Route path="/seller/book/:id/edit" element={<SellerAddBook />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/userlist" element={<UserList />} />
          <Route path="/admin/user/:id/edit" element={<UserEdit />} />
          <Route path="/admin/user/new" element={<UserEdit />} />
          <Route path="/admin/sellerlist" element={<SellerList />} />
          <Route path="/admin/sellers-inventory" element={<AdminSellersInventory />} />
          <Route path="/admin/booklist" element={<BookList />} />
          <Route path="/admin/book/:id/edit" element={<BookEdit />} />
          <Route path="/admin/book/new" element={<BookEdit />} />
          <Route path="/admin/orderlist" element={<OrderList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

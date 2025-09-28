import { createContext, useState } from 'react'

import './App.css'
import Sidebar from './components/Sidebar'
import 'react-toastify/dist/ReactToastify.css';
import {toast , ToastContainer } from 'react-toastify'
import Category from './pages/category/Category'
import Products from './pages/product/Products'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Login from './components/Login'
import Customers from './pages/customer/Customers';
import Dashboard from './pages/dashboard/Dashboard';
import Orders from './pages/order/Orders';
import ViewOrder from './pages/order/ViewOrder';
import SubCategory from './pages/category/SubCategory';
import Offer from './pages/Offers/Offer';
import Discount from './pages/discount/Discount';
import ShiprocketOrder from './pages/ShiprocketOrder/ShiprocketOrder';
import RazorpayOrders from './pages/razorpay/RazorpayOrders';
import ViewRazorpayOrder from './pages/razorpay/ViewRazorpayOrder';
import RefundedOrders from './pages/razorpay/RefundedOrders';
import ReturnOrders from './pages/ShiprocketOrder/ReturnOrders';
import ManageProduct from './pages/product/ManageProduct';
import 'react-datepicker/dist/react-datepicker.css';

export let navOpen = createContext()
function App() {
  const [count, setCount] = useState(0)
  const [showIcons, setShowIcons] = useState(true)
  const [nav, setNav] = useState("Dashboard")
  return (
    <>
    <navOpen.Provider value={{ showIcons, setShowIcons , nav , setNav }}>
      <Router>
        <Routes>
          <Route path="*" element={<Login/>} />
          <Route path="/" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />

          {/* category */}
          <Route path="/category" element={<Category/>} />
          <Route path="/sub-categories" element={<SubCategory/>} />

          {/* products */}
          <Route path="/products" element={<Products/>} />
          <Route path="/manage-product" element={<ManageProduct/>} />

          {/* customers */}
          <Route path="/customers" element={<Customers/>} />
          {/* <Route path="/add-product" element={<AddProduct/>} />
          <Route path="/edit-product/:id" element={<EditProduct/>} /> */}

          {/* orders */}
          <Route path="/orders" element={<Orders/>} />
          <Route path="/view-order/:id" element={<ViewOrder/>} />

          {/* Shiprocketorders */}
          <Route path="/returned-orders" element={<ReturnOrders/>} />
          <Route path="/shiprocket-orders" element={<ShiprocketOrder/>} />
          <Route path="/view-order/:id" element={<ViewOrder/>} />
          
          {/* Razorpay */}
          <Route path="/razorpay" element={<RazorpayOrders/>} />
          <Route path="/view-razorpay-payment/:id" element={<ViewRazorpayOrder/>} />
          <Route path="/refund-orders" element={<RefundedOrders/>} />



          <Route path="/offers" element={<Offer/>} />
          <Route path="/discount" element={<Discount/>} />
          {/* <Route path="/view-order/:id" element={<ViewOrder/>} /> */}
          {/* <Route path="/add-product" element={<AddProduct/>} />
          <Route path="/edit-product/:id" element={<EditProduct/>} /> */}
        </Routes>
      </Router>
      <ToastContainer />

  
    </navOpen.Provider>
    
    </>
  )
}

export default App

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
// import { ChevronDownIcon, XIcon } from '@heroicons/react/solid';
import 'react-datepicker/dist/react-datepicker.css';

// Dummy actions
const actions = ["Cancel Order", "Delete Order", "Edit", "Ready to Pickup", "Ship Order"];

const AdminOrderTable = ({ orders=[] }) => {
    const baseUrl = import.meta.env.VITE_IMG_BASE_URL
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const filteredOrders = orders.filter(order => {
    const name = order.userId?.name?.toLowerCase() || '';
    const createdAt = new Date(order.createdAt);
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus = status ? order.deliveryStatus === status : true;
    const matchesFrom = fromDate ? createdAt >= fromDate : true;
    const matchesTo = toDate ? createdAt <= toDate : true;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const handleAction = (orderId, action) => {
    alert(`${action} on ${orderId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Orders</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by customer"
          className="p-2 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          placeholderText="From Date"
          className="p-2 border rounded w-full"
        />
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          placeholderText="To Date"
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-2" onClick={() => setSelectedOrder(order)}>{order.orderId}</td>
                <td className="px-4 py-2" onClick={() => setSelectedOrder(order)}>{order.userId?.name}</td>
                <td className="px-4 py-2" onClick={() => setSelectedOrder(order)}>{order.deliveryStatus}</td>
                <td className="px-4 py-2" onClick={() => setSelectedOrder(order)}>₹{order.finalAmount}</td>
                <td className="px-4 py-2" onClick={() => setSelectedOrder(order)}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 relative">
                  <button
                    onClick={() => setDropdownOpenId(order._id === dropdownOpenId ? null : order._id)}
                    className="p-1 border rounded flex items-center"
                  >
                    <span className="mr-1">Actions</span>
                    {/* <ChevronDownIcon className="w-4 h-4" /> */}
                  </button>
                  {dropdownOpenId === order._id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow border rounded z-10">
                      {actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleAction(order.orderId, action);
                            setDropdownOpenId(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="p-4 text-gray-500">No orders found.</p>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              {/* <XIcon className="w-5 h-5" /> */} x
            </button>
            <h3 className="text-lg font-semibold mb-4">Order: {selectedOrder.orderId}</h3>

            <p className="mb-2"><strong>Customer:</strong> {selectedOrder.userId?.name}</p>
            <p className="mb-2"><strong>Status:</strong> {selectedOrder.deliveryStatus}</p>
            <p className="mb-4"><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>

            <p className="font-medium mb-2">Items:</p>
            <ul className="space-y-2 text-sm">
              {JSON.parse(selectedOrder.items || '[]').map((item, idx) => (
                <li key={idx} className="flex justify-between border-b pb-1">
                  <div className="flex gap-2">
                    <div >
                        <img src={`${baseUrl}${item?.images?.[0]}`} alt="" style={{height:  100 , width:100 ,}} />
                    </div>
                    <div>

                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>₹{item.priceAfterDiscount} x {item.quantity}</p>
                    <p className="text-gray-400 text-xs line-through">₹{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderTable;

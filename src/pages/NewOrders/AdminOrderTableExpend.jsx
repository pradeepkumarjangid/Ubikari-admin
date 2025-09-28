import React, { useState } from "react";

const AdminOrderTableExpandable = ({ orders = [] }) => {
     const baseUrl = import.meta.env.VITE_IMG_BASE_URL
  const [expandedRowIds, setExpandedRowIds] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Date picker imports & styles
  // Install: npm install react-datepicker
  // Import 'react-datepicker/dist/react-datepicker.css' in your app root

  // Helper to toggle expanded rows
  const toggleExpand = (id) => {
    setExpandedRowIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [ id]
    );
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const name = order.userId?.name?.toLowerCase() || "";
    const createdAt = new Date(order.createdAt);
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus = status ? order.deliveryStatus === status : true;
    const matchesFrom = fromDate ? createdAt >= fromDate : true;
    const matchesTo = toDate ? createdAt <= toDate : true;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  // Action buttons (dummy)
  const actions = [
    "Cancel Order",
    "Delete Order",
    "Edit",
    "Ready to Pickup",
    "Ship Order",
  ];

  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const handleAction = (orderId, action) => {
    alert(`${action} on ${orderId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Admin Orders (Expandable Rows)
      </h2>

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
        {/* Replace with react-datepicker components if you want */}
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={fromDate ? fromDate.toISOString().slice(0, 10) : ""}
          onChange={(e) =>
            setFromDate(e.target.value ? new Date(e.target.value) : null)
          }
        />
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={toDate ? toDate.toISOString().slice(0, 10) : ""}
          onChange={(e) =>
            setToDate(e.target.value ? new Date(e.target.value) : null)
          }
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const isExpanded = expandedRowIds.includes(order._id);
              return (
                <React.Fragment key={order._id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => toggleExpand(order._id)}
                    >
                      {isExpanded ? "−" : "+"}
                    </td>
                    <td className="px-4 py-2">{order.orderId}</td>
                    <td className="px-4 py-2">{order.userId?.name}</td>
                    <td className="px-4 py-2">{order.deliveryStatus}</td>
                    <td className="px-4 py-2">₹{order.finalAmount}</td>
                    <td className="px-4 py-2">{order.paymentMethod}</td>
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 relative">
                      <button
                        onClick={() =>
                          setDropdownOpenId(
                            order._id === dropdownOpenId ? null : order._id
                          )
                        }
                        className="p-1 border rounded flex items-center"
                      >
                        Actions
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
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
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-8 py-4">
                        <div>
                          {/* <h4 className="font-semibold mb-2">Items</h4> */}
                          <ul>
                            {JSON.parse(order.items || "[]").map(
                              (item, idx) => (
                                <li
                                  key={idx}
                                  className="mb-2 flex justify-between border-b pb-1"
                                >
                                  <div className="flex gap-2">
                                    <div>
                                      <img
                                        src={`${baseUrl}${item?.images?.[0]}`}
                                        alt=""
                                        style={{ height: 40, width: 40 }}
                                      />
                                    </div>{" "}
                                    <div>
                                      <p className="font-medium">
                                        {item.productName}
                                      </p>
                                      <p className="text-gray-600 text-xs">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p>
                                      ₹{item.priceAfterDiscount} ×{" "}
                                      {item.quantity}
                                    </p>
                                    <p className="text-gray-400 text-xs line-through">
                                      ₹{item.price}
                                    </p>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <p className="p-4 text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderTableExpandable;

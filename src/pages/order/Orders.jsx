import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminOrderTableExpandable from "../NewOrders/AdminOrderTableExpend";

export default function Orders() {
  let navigate = useNavigate();
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const { showIcons, setShowIcons } = useContext(navOpen);
  const [status, setStatus] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };

  const getOrders = async () => {
    try {
      let result = await apiObj.getOrders(headers);
      if (result.data.orders && result.data.orders.length > 0) {
        setOrders(result.data.orders);
      } else {
        setOrders([]);
      }
      console.log(result);
    } catch (err) {
      console.log(err);
      if (err.message && err.message == "Network Error") {
        setOrders([]);
      }
    }
  };
  const searchOrder = async (query) => {
    if (query.length > 0) {
      try {
        let result = await apiObj.searchOrder(query, headers);
        if (result.data.data && result.data.data.length > 0) {
          setOrders(result.data.data);
        } else {
          setOrders([]);
        }
        console.log(result);
      } catch (err) {
        console.log(err);
        if (err.response) {
          if (err.response.data.message == "No orders found") {
            setOrders([]);
          }
        }
      }
    } else {
      getOrders();
    }
  };
  const deleteOrder = async () => {
    let id = currentOrder ? currentOrder._id : null;
    try {
      let result = await apiObj.deleteOrder(id, headers);

      notifySuccess("Order deleted successfully");
      getOrders();
      setDeleteBox(false);
      setCurrentProduct(false);
      console.log(result);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data.message) {
        notifyError(err.response.data.message);
      }
    }
  };
  const editOrder = async (order, status) => {
    let data = {
      status: status,
    };
    try {
      let result = await apiObj.editOrder(order._id, data, headers);
      console.log(result);
      notifySuccess("Order Updated ");
      getOrders();
    } catch (err) {
      if (
        err.response &&
        err.response.data.error == " Request is not authorized"
      ) {
        notifyError("Please Login Again");
        localStorage.removeItem("UNIKARIADMIN");
        navigate("/");
      }
      console.log(err);
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      month: "short", // "Oct"
      day: "2-digit", // "27"
      year: "numeric", // "2024"
      hour: "2-digit", // "01"
      minute: "2-digit", // "17"
      hour12: true, // "AM" or "PM"
    };

    // Convert the date to desired format
    return date.toLocaleString("en-US", options).replace(",", "");
  }
  useEffect(() => {
    getOrders();
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("UNIKARIADMIN")) {
      navigate("/");
    }
  });
  return (
    <div>
      <Layout>
        <div
          className={`
            ${
              showIcons
                ? "md:w-[calc(100vw-292px)] w-[calc(100vw-17px)]"
                : "md:w-[calc(100vw-102px)] w-[calc(100vw-17px)]"
            }
           duration-700  `}
        >
          <div className="flex justify-end flex-wrap gap-4 px-2 items-center w-full">
            <div className="relative ">
              <input
                type="search"
                className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
                placeholder="Search..."
                onChange={(e) => searchOrder(e.target.value)}
              />
            </div>
          </div>

          {/* <AdminOrderTable orders={orders}/> */}
          <AdminOrderTableExpandable orders={orders} />
        </div>
      </Layout>

     
    </div>
  );
}

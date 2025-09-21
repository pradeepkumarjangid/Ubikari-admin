import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Customers() {
  let navigate = useNavigate();
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const { showIcons, setShowIcons } = useContext(navOpen);
  const [status, setStatus] = useState(true);
  const [customers, setCustomers] = useState(false);
  const [currentCstomer, setCurrentCustomer] = useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };
  const toggleStatus = () => {
    setStatus(!status);
    // Handle your API call or state update here
    console.log("Status updated:", !status);
  };

  const getCustomers = async () => {
    try {
      let result = await apiObj.getCustomers(headers);
      if (result.data.customers && result.data.customers.length > 0) {
        setCustomers(result.data.customers);
      } else {
        setCustomers("no data");
      }
      console.log(result);
    } catch (err) {
      console.log(err);
      if (err.message && err.message == "Network Error") {
        setCustomers("Network");
      }
    }
  };
  const searchCustomer = async (query) => {
    if (query.length > 0) {
      try {
        let result = await apiObj.searchCustomer(query, headers);
        if (result.data.data && result.data.data.length > 0) {
          setCustomers(result.data.data);
        } else {
          setCustomers("no data");
        }
        console.log(result);
      } catch (err) {
        console.log(err);
        if (err.response) {
          if (err.response.data.message == "No customers found") {
            setCustomers("no data");
          }
        }
      }
    } else {
      getCustomers();
    }
  };
  const deleteCustomer = async () => {
    let id = currentCstomer ? currentCstomer._id : null;
    try {
      let result = await apiObj.deleteCustomer(id, headers);
      notifySuccess("Customer deleted successfully");
      getCustomers();
      setDeleteBox(false);
      setCurrentCustomer(false);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
  const editCustomer = async (customer) => {
    let status = customer.status == "Active" ? "InActive" : "Active";
    let data = {
      status: status,
    };
    // data.append("status" , status)
    // activeStatus == "Active"
    console.log(status);

    try {
      let result = await apiObj.editCustomer(customer._id, data, headers);
      console.log(result);
      notifySuccess("Customer Status Updated ");
      getCustomers();
      // window.history.back()
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCustomers();
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
          <div className="flex justify-end flex-wrap gap-4  items-center w-full">
            <div className="relative ">
              <input
                type="search"
                className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
                placeholder="Search..."
                onChange={(e) => searchCustomer(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-5 max-w-[98vw] overflow-hidden ">
            <div className="overflow-auto">
              <table className="w-full min-w-[700px]  border">
                <thead>
                  <tr className="border p-2 font-semibold text-[16px] text-[#696cff]">
                    <th className="border">ID</th>
                    {/* <th className="border">IMG</th> */}
                    <th className="border"> NAME</th>
                    <th className="border">EMAIL</th>
                    <th className="border">CONTACT</th>
                    <th className="border p-2">STATUS</th>
                    <th className="border p-2">JOIN DATE</th>
                    <th className="border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers == false ? (
                    <p>Please wait...</p>
                  ) : customers == "no data" ? (
                    <p>No data found</p>
                  ) : customers == "Network" ? (
                    <p>Network Error</p>
                  ) : (
                    customers.map((customer, index) => (
                      <tr className="border p-2 hover:bg-white" key={index}>
                        <td className="text-center  border">{index + 1}</td>
                        <td className="text-center  border">{customer.name}</td>
                        <td className="text-center w-[] border">
                          {customer.email}
                        </td>
                        <td className="text-center w-[] border">
                          {customer.contact}
                        </td>

                        <td className="text-center  border p-2">
                          {" "}
                          <button
                            onClick={() => editCustomer(customer)}
                            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${
                              customer.status == "Active"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`${
                                customer.status == "Active"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                            />
                          </button>
                        </td>
                        <td className="text-center w-[] border">
                          {customer.createdAt.slice(0, 10)}
                        </td>
                        <td className="text-center w-[] border">
                          <p className="flex gap-3 w-full justify-center">
                            {/* <IoEyeOutline className="text-[#696cff] text-[20px] cursor-pointer"/> */}
                            {/* <MdOutlineModeEdit className=" text-[20px] cursor-pointer" 
                    onClick={()=>navigate(`/edit-product/${product._id}`)}
                    /> */}
                            <RiDeleteBin6Line
                              className="text-[red] text-[20px] cursor-pointer"
                              onClick={() => {
                                setCurrentCustomer(customer);
                                setDeleteBox(true);
                              }}
                            />
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>

      {/*  delete Category */}

      <div
        className={`${
          deleteBox ? "fixed" : "hidden"
        }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`}
        onClick={() => setDeleteBox(false)}
      ></div>
      <div
        className={`${
          deleteBox ? "fixed" : "hidden"
        } h-[180px]  max-w-[300px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}
      >
        <p className="bg-[#f5f5f9] p-2 text-[red] text-center font-bold fixed w-full  top-0 right-0 ">
          Delete Category
        </p>

        <p className="pt-[50px] text-center px-5">
          {" "}
          Are you sure , you want to delete product
        </p>

        <p className="flex justify-between px-4 pt-6">
          <button
            className="p-2 px-4 text-white bg-[#776565] rounded-md"
            onClick={() => {
              setDeleteBox(false);
              setCurrentCustomer(null);
            }}
          >
            Cancel
          </button>
          <button
            className="p-2 px-4 text-white bg-[#696cff] rounded-md"
            onClick={deleteCustomer}
          >
            Delete
          </button>
        </p>
      </div>
    </div>
  );
}

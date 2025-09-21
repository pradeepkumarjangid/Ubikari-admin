import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import apiObj from "../../services/api";
import { toast } from "react-toastify";

export default function Offer() {
  let navigate = useNavigate();
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const { showIcons, setShowIcons } = useContext(navOpen);
  const [status, setStatus] = useState(true);
  const [viewAddCategory, setViewAddCategory] = useState(false);
  const [viewCategory, setViewCategory] = useState(false);
  const [viewEditCategory, setViewEditCategory] = useState(false);
  const [categoryImg, setCategoryImg] = useState(false);
  const [categoryImgUrl, setCategoryImgUrl] = useState(false);
  const [currentOffer, setCurrentOffer] = useState();
  const [deleteBox, setDeleteBox] = useState(false);
  let [categoryName, setCategoryName] = useState();
  const [categories, setCategories] = useState([]);

  // offers fields
  let [code, setCode] = useState();
  let [discountType, setDiscountType] = useState("Fix");
  let [discountValue, setDiscountValue] = useState();
  let [useTime, setUseTime] = useState();
  let [priceLimit, setPriceLimit] = useState();
  let [desc, setDesc] = useState();

  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };
  function convertToSlug(name) {
    return name.toLowerCase().replace(/\s+/g, "-");
  }
  const categoryImgFunc = (e) => {
    let file = e.target.files[0];
    if (file) {
      setCategoryImg(file);
    } else {
      alert("please select image");
    }
  };
  const toggleStatus = async (category) => {
    let data = {
        Status : category.Status == "Active" ? "InActive" : "Active"
    }
   
    try {
      let id = category._id;
      let result = await apiObj.editOffer(id, data, headers);
      notifySuccess("Offer Status Updated ");
      getOffers();
      setViewEditCategory(false);
      setCurrentOffer(null);
    //   console.log(result)
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

  const getOffers = async () => {
    try {
      let result = await apiObj.getOffers(headers);
      if (result.data.Catagories && result.data.Catagories.length > 0) {
        setCategories(result.data.Catagories);
      } else {
        setCategories("no data");
      }
      console.log(result);
    } catch (err) {
      if (err.message && err.message == "Network Error") {
        setCategories("Network");
      }
      console.log(err);
    }
  };
  const searchCategory = async (query) => {
    if (query.length > 0) {
      try {
        let result = await apiObj.searchOffer(query, headers);
        if (result.data.coupons && result.data.coupons.length > 0) {
          setCategories(result.data.coupons);
        } else {
          setCategories("no data");
        }
        console.log(result);
      } catch (err) {
        console.log(err);
        if (err.response) {
          if (err.response.data.message =="No matching coupons found") {
            setCategories("no data");
          }
          
        }
      }
    } else {
      getOffers();
    }
  };
  const createOffer = async () => {
    if (!code) {
      notifyError("Please enter Coupon Code ");
    } else if (!discountValue) {
      notifyError("Please enter discount value");
    } else if (!desc) {
      notifyError("Please enter description");
    } else {
      let data = {
        coupenCode: code ,
        description : desc ,
        discountType : discountType ,
        discountValue : +discountValue ,
        // expireyDate : expireyDate ,
        minOrderPriceforCouponUse : +priceLimit,
        useCouponNoOfTimes : +useTime


      };
      console.log(data)
      
      try {
        let result = await apiObj.createOffer(data, headers);
        notifySuccess("Offer created successfully");
        getOffers();
        setCode("");
        setDesc("");
        setDiscountValue("");
        setPriceLimit("");
        setUseTime("")
          setViewAddCategory(false);
        console.log(result);
      } catch (err) {
        if (
          err.response &&
          err.response.data.error == " Request is not authorized"
        ) {
          notifyError("Please Login Again");
          localStorage.removeItem("UNIKARIADMIN");
          navigate("/");
        }
        if (err.message && err.message == "Network Error") {
          notifyError("Network Error");
        }

        console.log(err);
      }
    }
  };
  const editOffer = async () => {
    if (!code) {
      notifyError("Please enter Coupon Code ");
    } else if (!discountValue) {
      notifyError("Please enter discount value");
    } else if (!desc) {
      notifyError("Please enter description");
    } else {
        let data = {
            coupenCode: code ,
            description : desc ,
            discountType : discountType ,
            discountValue : +discountValue ,
            // expireyDate : expireyDate ,
            minOrderPriceforCouponUse : +priceLimit,
            useCouponNoOfTimes : +useTime
    
    
          };
      try {
        let id = currentOffer ? currentOffer._id : null;
        let result = await apiObj.editOffer(id, data, headers);
        notifySuccess("Offer Edited successfully");
        getOffers();
        setCode("");
        setDesc("");
        setDiscountValue("");
        setPriceLimit("");
        setUseTime("")
        setViewEditCategory(false);
        setCurrentOffer(null);
        console.log(result);
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
    }
  };

  const deleteOffer = async () => {
    try {
      let id = currentOffer ? currentOffer._id : null;
      let result = await apiObj.deleteOffer(id, headers);
      console.log(result);
      notifySuccess("Offer deleted successfully");
      getOffers();
      setDeleteBox(false);
      setCurrentOffer(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("UNIKARIADMIN")) {
      navigate("/");
    }
  });
  useEffect(() => {
    getOffers();
  }, []);
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
          <div className="flex justify-between flex-wrap gap-4 items-center w-full px-3 sm:px-0">
            <div className="relative">
              <input
                type="search"
                className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
                placeholder="Search..."
                onChange={(e) => searchCategory(e.target.value)}
              />
            </div>
            <div className="pr-3">
              <button
                className="bg-[#696cff] border hover:shadow-lg border-[#696cff] text-white py-1 px-3 rounded-md "
                onClick={() => setViewAddCategory(true)}
              >
                Add New
              </button>
            </div>
          </div>

          <div
            className={`
          ${
            showIcons
              ? "md:max-w-[calc(100vw-292px)] "
              : "md:max-w-[calc(100vw-102px)] "
          }
         duration-700  overflow-hidden pt-5`}
          >
            <div
              className={`
          ${
            showIcons
              ? "md:max-w-[calc(100vw-292px)] "
              : "md:max-w-[calc(100vw-102px)] "
          }
         duration-700  overflow-auto pb-5`}
            >
              <table className="  w-full min-w-[1000px]   border">
                <thead>
                  <tr className="border font-semibold text-[16px] text-[#696cff]">
                    <th className="border">Sr. No.</th>
                    <th className="border"> Code</th>
                    <th className="border">Type</th>
                    <th className="border">Discount</th>
                    <th className="border">Use Times</th>
                    <th className="border py-2 ">Price Limit</th>
                    <th className="border">Status</th>
                    <th className="border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories == false ? (
                    <p className="text-center">Please Wait...</p>
                  ) : categories == "no data" ? (
                    <p>No data found</p>
                  ) : categories == "Network" ? (
                    <p>Network Error</p>
                  ) : (
                    categories.map((category, index) => (
                      <tr className="border hover:bg-white " key={index}>
                        <td className="text-center  border">{index + 1}</td>
                        {/* <td className="text-center  border">
                  <img src={category.imageUrl} alt="iimg" className="h-[45px] w-[45px] mx-auto" />
                </td> */}
                        <td className="text-center  border">
                          {category.coupenCode}
                        </td>

                        <td className="text-center w-[] border">
                          {category.discountType}
                        </td>
                        <td className="text-center w-[] border">
                          {category.discountValue}
                        </td>
                        <td className="text-center w-[] border">
                          {category.useCouponNoOfTimes}
                        </td>
                        <td className="text-center w-[] border">
                          {category.minOrderPriceforCouponUse}
                        </td>
                        <td className="text-center  border py-2 ">
                          {" "}
                          <button
                            onClick={() => toggleStatus(category)}
                            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${
                              category.Status == "Active"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`${
                                category.Status == "Active"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                            />
                          </button>
                        </td>
                        <td className="text-center w-[] border">
                          <p className="flex gap-3 w-full justify-center">
                            {/* <IoEyeOutline className="text-[#696cff] text-[20px] cursor-pointer" onClick={()=>{
                    setCurrentOffer(category)
                    setViewCategory(true)
                  }}/> */}
                            <MdOutlineModeEdit
                              className=" text-[20px] cursor-pointer"
                              onClick={() => {
                                setCurrentOffer(category);
                                setViewEditCategory(true);
                                setCode(category.coupenCode);
                                setDesc(category.description);
                                setDiscountType(category.discountType)
                                setDiscountValue(category.discountValue)
                                setPriceLimit(category.minOrderPriceforCouponUse)
                                setUseTime(category.useCouponNoOfTimes)
                          
                              }}
                            />
                            <RiDeleteBin6Line
                              className="text-[red] text-[20px] cursor-pointer"
                              onClick={() => {
                                setCurrentOffer(category);
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

      {/*  Add Category */}

      <div
        className={`${
          viewAddCategory ? "fixed" : "hidden"
        }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`}
        onClick={() => setViewAddCategory(false)}
      ></div>
      <div
        className={`${
          viewAddCategory ? "fixed" : "hidden"
        } h-[90vh] max-h-[500px] max-w-[450px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}
      >
        <p className="bg-[#f5f5f9] p-2 text-[#696cff] text-center font-bold fixed w-full  top-0 right-0 ">
          Add OFFER
        </p>

        <div className=" max-h-[500px]  h-[90vh] sidebar overflow-auto pt-[36px]">
          {/* coupon code */}
          <div className="p-3">
            <p className="font-[500] pb-2">Coupon Code :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Coupon Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          {/* discount type */}
          <div className="p-3">
            <p className="font-[500] pb-2">Discount Type :</p>
            <select
              name=""
              id=""
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="Fix">Fix</option>
              <option value="Percent">Percent</option>
            </select>
          </div>
          {/* discount value */}
          <div className="p-3">
            <p className="font-[500] pb-2">Discount Value :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Discount Value"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>
          {/* Use Times */}
          <div className="p-3">
            <p className="font-[500] pb-2">Use Time :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Use Time"
              value={useTime}
              onChange={(e) => setUseTime(e.target.value)}
            />
          </div>
          {/* Price Limit */}
          <div className="p-3">
            <p className="font-[500] pb-2">Minimum Price :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Minimum Price Limit"
              value={priceLimit}
              onChange={(e) => setPriceLimit(e.target.value)}
            />
          </div>
          {/* Description */}
          <div className="p-3">
            <p className="font-[500] pb-2">Description :</p>
            <textarea
              type="text"
              className="w-full h-[100px] py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="p-3">
            <button
              className="bg-[#696cff] w-full text-white p-2 rounded-md hover:font-semibold hover:bg-[#5d60f7]"
              onClick={createOffer}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/*  Edit Offer */}

      <div
        className={`${
          viewEditCategory ? "fixed" : "hidden"
        }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`}
        onClick={() => {
            setViewEditCategory(false)
            setCode("");
            setDesc("");
            setDiscountType("Fix")
            setDiscountValue("")
            setPriceLimit("")
            setUseTime("")
      
        }}
      ></div>
      <div
        className={`${
          viewEditCategory ? "fixed" : "hidden"
        } h-[90vh] max-h-[500px] max-w-[450px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}
      >
        <p className="bg-[#f5f5f9] p-2 text-[#696cff] text-center font-bold fixed w-full  top-0 right-0 ">
          Edit OFFER
        </p>

        <div className=" max-h-[500px]  h-[90vh] sidebar overflow-auto pt-[36px]">
          {/* coupon code */}
          <div className="p-3">
            <p className="font-[500] pb-2">Coupon Code :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Coupon Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          {/* discount type */}
          <div className="p-3">
            <p className="font-[500] pb-2">Discount Type :</p>
            <select
              name=""
              id=""
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="Fix">Fix</option>
              <option value="Percent">Percent</option>
            </select>
          </div>
          {/* discount value */}
          <div className="p-3">
            <p className="font-[500] pb-2">Discount Value :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Discount Value"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>
          {/* Use Times */}
          <div className="p-3">
            <p className="font-[500] pb-2">Use Time :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Use Time"
              value={useTime}
              onChange={(e) => setUseTime(e.target.value)}
            />
          </div>
          {/* Price Limit */}
          <div className="p-3">
            <p className="font-[500] pb-2">Minimum Price :</p>
            <input
              type="text"
              className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Minimum Price Limit"
              value={priceLimit}
              onChange={(e) => setPriceLimit(e.target.value)}
            />
          </div>
          {/* Description */}
          <div className="p-3">
            <p className="font-[500] pb-2">Description :</p>
            <textarea
              type="text"
              className="w-full h-[100px] py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="p-3">
            <button
              className="bg-[#696cff] w-full text-white p-2 rounded-md hover:font-semibold hover:bg-[#5d60f7]"
              onClick={editOffer}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/*  delete Offer */}

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
          Delete Offer
        </p>

        <p className="pt-[50px] text-center px-5">
          {" "}
          Are you sure , you want to delete Offer
        </p>

        <p className="flex justify-between px-4 pt-6">
          <button
            className="p-2 px-4 text-white bg-[#776565] rounded-md"
            onClick={() => {
              setDeleteBox(false);
              setCurrentOffer(null);
            }}
          >
            Cancel
          </button>
          <button
            className="p-2 px-4 text-white bg-[#696cff] rounded-md"
            onClick={deleteOffer}
          >
            Delete
          </button>
        </p>
      </div>
    </div>
  );
}

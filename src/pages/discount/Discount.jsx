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

export default function Discount() {
    let navigate = useNavigate();
    const notifyError = (msg) => toast.error(msg);
    const notifySuccess = (msg) => toast.success(msg);
    const { showIcons, setShowIcons } = useContext(navOpen);
    const [discountType, setDiscountType] = useState("all-products");
    const [percentage, setPercentage] = useState("");
    const [status, setStatus] = useState(true);
    const [viewAddCategory, setViewAddCategory] = useState(false);
    const [viewCategory, setViewCategory] = useState(false);
    const [viewEditCategory, setViewEditCategory] = useState(false);
    const [categoryImg, setCategoryImg] = useState(false);
    const [categoryImgUrl, setCategoryImgUrl] = useState(false);
    const [currentOffer, setCurrentOffer] = useState();
    const [deleteBox, setDeleteBox] = useState(false);
    let [selectedOption, setSelectedOption] = useState("All Products");
    const [categories, setCategories] = useState([]);
  
  
  
    let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
    UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
    let headers = {
      Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
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
   
    const handleSubmit = async(e) => {
      e.preventDefault();
      // Handle form submission logic here

      // let currentCategory 
      let categoryId = ""
      let discount = +percentage
      if(categories && categories !== 'no data' &&  categories !== "Network Error" && selectedOption !== "All Products" ){
          let selected = categories.filter((item)=>item.name == selectedOption)
          if(selected && selected[0]){

            categoryId = selected[0]._id
          }
      }
    
      let data = {discount }
      if(categoryId){
          data.categoryId = categoryId
      }
    
   

        try{
          let result = await apiObj.addDiscount(data , headers)
          notifySuccess("Discount Added")
        }catch(err){
          notifyError(err?.response?.data?.error || err?.response?.data?.message || err?.message)
        }
      
  
    };
    const getCategory = async()=>{
      try{
        let result = await apiObj.getCategory(headers)
        if(result.data.categories && result.data.categories.length > 0 ){
          setCategories(result.data.categories)
        }else{
          setCategories('no data')
        }
        console.log(result)
      }catch(err){
        if(err.message && err.message == "Network Error"){
          setCategories('Network')
        }
        console.log(err)
      }
    }
  
  
  
    useEffect(() => {
      if (!localStorage.getItem("UNIKARIADMIN")) {
        navigate("/");
      }
    });
    useEffect(() => {
      getCategory()
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
          {/* <div className="flex justify-between flex-wrap gap-4 items-center w-full px-3 sm:px-0">
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
          </div> */}

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
             

              <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Add Discount</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between flex-wrap items-end gap-4">

        {/* Discount Type Dropdown */}
        <div className="w-[20%] min-w-[250px]">
          <label
            htmlFor="discount-type"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Type
          </label>
          <select
            id="discount-type"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="mt-1 block w-full rounded-md border-black border-[1px]  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm focus:outline-none"
          >
            <option value="All-Products">All Products</option>
            {
                                 categories == false ? 
                                 <p className="text-center">Please Wait...</p> :
                                 categories == "no data" ?
                                 <p>No data found</p> :
                                 categories == "Network" ?
                                 <p>Network Error</p> :
                                 categories.map((category , index)=>(
                                    <option className={`hover:bg-[#696cff] p-[3px] px-3 cursor-pointer hover:text-white `} value={category.name}>{category.name}</option>
                                 ))
                            }
            {/* <option value="category">Category</option> */}
          </select>
        </div>

        {/* Percentage Input */}
        <div className="w-[20%] min-w-[250px]"> 
          <label
            htmlFor="percentage"
            className="block text-sm font-medium text-gray-700"
          >
            Percentage
          </label>
          <input
            type="number"
            id="percentage"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="mt-1 block w-full rounded-md border-black border-[1px]  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm focus:outline-none"
            placeholder="Enter percentage (e.g., 10)"
          />
        </div>

        {/* Submit Button */}
        <div className="min-w-[250px] w-[20%]">
          <button
            type="submit"
            className="w-full px-4 py-2 mt-1 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Discount
          </button>
        </div>
        </div>
      </form>
    </div>
            </div>
          </div>
        </div>



      </Layout>
    </div>
  )
}

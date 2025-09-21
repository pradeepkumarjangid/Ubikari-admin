import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import apiObj from "../../services/api";
import { toast } from "react-toastify";
import AddUpdateCategory from "./AddUpdateCategory";

export default function Category() {
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL
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
  const [currentCategory, setCurrentCategory] = useState();
  const [deleteBox, setDeleteBox] = useState(false);
  let [categoryName, setCategoryName] = useState();
  const [categories, setCategories] = useState([]);
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
    let data = new FormData();
    data.append("name", category.name);
    data.append("status", category.status == "Active" ? "InActive" : "Active");
    try {
      let id = category._id;
      let result = await apiObj.editCategory(id, data, headers);
      notifySuccess("Category Status Updated ");
      getCategory();
      setCategoryName();
      setCategoryImg(false);
      setViewEditCategory(false);
      setCurrentCategory(null);
      // console.log(result)
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

  const getCategory = async () => {
    try {
      let result = await apiObj.getCategory(headers);
      if (result.data.categories && result.data.categories.length > 0) {
        setCategories(result.data.categories);
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
        let result = await apiObj.searchCategory(query, headers);
        if (result.data.data && result.data.data.length > 0) {
          setCategories(result.data.data);
        } else {
          setCategories("no data");
        }
        console.log(result);
      } catch (err) {
        console.log(err);
        if (err.response) {
          if (err.response.data.message == "No customers found") {
            setCategories("no data");
          }
        }
      }
    } else {
      getCategory();
    }
  };

  const deleteCategory = async () => {
    try {
      let id = currentCategory ? currentCategory._id : null;
      let result = await apiObj.deleteCategory(id, headers);
      console.log(result);
      notifySuccess("Category deleted successfully");
      getCategory();
      setDeleteBox(false);
      setCurrentCategory(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    if(viewAddCategory == false){
      setCurrentCategory(false)
    }
  },[viewAddCategory])
  useEffect(() => {
    if (!localStorage.getItem("UNIKARIADMIN")) {
      navigate("/");
    }
  });
  useEffect(() => {
    getCategory();
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
                    <th className="border">ID</th>
                    <th className="border">IMG</th>
                    <th className="border">CATEGORY</th>
                    <th className="border">SLUG</th>
                    <th className="border py-2 ">STATUS</th>
                  
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
                        <td className="text-center  border">
                          {category.catId}
                        </td>
                        <td className="text-center  border">
                          <img
                            src={`${baseUrl}${category.catImg}`}
                            alt="iimg"
                            className="h-[45px] w-[45px] mx-auto"
                          />
                        </td>
                        <td className="text-center  border">{category.name}</td>
                        <td className="text-center  border">
                          {category.slugName}
                        </td>
                        <td className="text-center  border py-2 ">
                          <button
                            onClick={() => toggleStatus(category)}
                            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${
                              category.status == "Active"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`${
                                category.status == "Active"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                            />
                          </button>
                        </td>
                       
                        <td className="text-center w-[] border">
                          <p className="flex gap-3 w-full justify-center">
                            {/* <IoEyeOutline className="text-[#696cff] text-[20px] cursor-pointer" onClick={()=>{
                      setCurrentCategory(category)
                      setViewCategory(true)
                    }}/> */}
                            <MdOutlineModeEdit
                              className=" text-[20px] cursor-pointer"
                              onClick={() => {
                                setCurrentCategory(category);
                                setViewAddCategory(true);
                              }}
                            />
                            <RiDeleteBin6Line
                              className="text-[red] text-[20px] cursor-pointer"
                              onClick={() => {
                                setCurrentCategory(category);
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
      {viewAddCategory && <AddUpdateCategory viewAddCategory={viewAddCategory} setViewAddCategory={setViewAddCategory} getCategory={getCategory} editCategoryData={currentCategory} />}


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
          Are you sure , you want to delete category
        </p>

        <p className="flex justify-between px-4 pt-6">
          <button
            className="p-2 px-4 text-white bg-[#776565] rounded-md"
            onClick={() => {
              setDeleteBox(false);
              setCurrentCategory(null);
            }}
          >
            Cancel
          </button>
          <button
            className="p-2 px-4 text-white bg-[#696cff] rounded-md"
            onClick={deleteCategory}
          >
            Delete
          </button>
        </p>
      </div>
    </div>
  );
}

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
import ManageSubCategory from "./ManageSubCategory";
export default function SubCategory() {
    const baseUrl = import.meta.env.VITE_IMG_BASE_URL
    let navigate = useNavigate()
  const notifyError = (msg) =>  toast.error(msg)
    const notifySuccess = (msg) => toast.success(msg)
  const { showIcons, setShowIcons } = useContext(navOpen);
  
  const [viewAddCategory , setViewAddCategory] = useState(false)
  
  const [viewEditCategory , setViewEditCategory] = useState(false)

  const[currentCategory , setCurrentCategory] = useState()
  const[currentSubCategory , setCurrentSubCategory] = useState()
  const[deleteBox , setDeleteBox] = useState(false)
  let[categoryName , setCategoryName]=useState()
  const[categoryImg , setCategoryImg] = useState(false)
  const[categoryImgUrl , setCategoryImgUrl] = useState(false)
  const [categories , setCategories] = useState([])
  const [subCategories , setSubCategories] = useState([])
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };
  function convertToSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}
  const toggleStatus = async(category)=> {
    
      let data = {
        status : category.status == "Active" ? "InActive" : "Active"
      }
      try{
        let id =  category._id 
        let result = await apiObj.editSubCategory( id, data , headers)
        notifySuccess('Category Status Updated ')
        getSubCategory()
        setCategoryName()
        // setCategoryImg(false)
        setViewEditCategory(false)
        setCurrentCategory(null)
        console.log(result)
      }catch(err){
        if(err.response && err.response.data.error == " Request is not authorized"){
          notifyError('Please Login Again')
          localStorage.removeItem('UNIKARIADMIN')
          navigate('/')
        }
        console.log(err)
      }
    
  };
  let clearData = ()=>{
    setCurrentCategory(false)
    setCategoryName("")
    setCategoryImg("")
    setCategoryImgUrl("")
    setViewAddCategory(false)
  }
 const getCategory = async () => {
  try {
    const UNIKARIADMIN = JSON.parse(localStorage.getItem("UNIKARIADMIN") || "{}");
    const headers = { Authorization: `Bearer ${UNIKARIADMIN?.token || ""}` };

    const result = await apiObj.getCategory(headers);

    if (result?.data?.categories?.length > 0) {
      const activeCategories = result.data.categories
        .filter((cat) => cat.status !== "InActive")
        .map((cat) => ({
          name: cat.name,
          _id: cat._id,
        }));

      setCategories(activeCategories);
    } else {
      setCategories([]);
    }

    console.log(result);
  } catch (err) {
    if (err.message === "Network Error") {
      setCategories([]);
    }
    console.log(err);
  }
};

  const getSubCategory = async()=>{
    try{
      let result = await apiObj.getSubCategory(headers)
      if(result.data.subcategories && result.data.subcategories.length > 0 ){
        setSubCategories(result.data.subcategories)
      }else{
        setSubCategories('no data')
      }
      console.log(result)
    }catch(err){
      if(err.message && err.message == "Network Error"){
        setSubCategories('Network')
      }
      console.log(err)
    }
  }
  const searchCategory = async(query)=>{
    if(query.length > 0){

      try{
        let result = await apiObj.searchSubCategory(query , headers)
        if(result.data.subcategories && result.data.subcategories.length > 0 ){
          setSubCategories(result.data.subcategories)
        }else{
          setSubCategories('no data')
        }
        console.log(result)
      }catch(err){
        console.log(err)
        if(err.response){
          if(err.response.data.error == "No subcategories found"){
            setSubCategories('no data')
          }
        }
      }
    }else{
      getSubCategory()
    }
  }
  const categoryImgFunc = (e)=>{
    let file = e.target.files[0]
    if(file){
      setCategoryImg(file)
    }else{
      alert('please select image')
    }
  }
  const editCategory = async()=>{
    if(!categoryName){
      notifyError('Please enter category name ')
    }else{
      let slug = convertToSlug(categoryName)
      let data = {
        name : categoryName,
        parentCategoryId : currentCategory ? currentCategory._id : "",
        subCatSlugName : slug
      }
      let formData = new FormData()
      formData.append("subCatSlugName" , slug)
      formData.append("name" , categoryName)
      formData.append("parentCategoryId" , currentCategory ? currentCategory._id : "")
      formData.append("image" , categoryImg)
      console.log(data)

      try{
        let id = currentSubCategory ? currentSubCategory._id : null
        let result = await apiObj.editSubCategory( id, formData , headers)
        notifySuccess('Category Edited successfully')
        getSubCategory(false)
        clearData()
        // setCategoryImg(false)
        setViewEditCategory(false)
        setCurrentCategory(null)
        console.log(result)
      }catch(err){
        if(err.response && err.response.data.error == " Request is not authorized"){
          notifyError('Please Login Again')
          localStorage.removeItem('UNIKARIADMIN')
          navigate('/')
        }
        console.log(err)
      }

    }
  }

  const deleteCategory = async()=>{
    try{
      let id = currentSubCategory ? currentSubCategory._id : null
      let result = await apiObj.deleteSubCategory(id , headers)
      console.log(result)
      notifySuccess('Category deleted successfully')
      getSubCategory()
      setDeleteBox(false)
                setCurrentCategory(null)
                setCurrentSubCategory(null)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(!localStorage.getItem('UNIKARIADMIN')){
        navigate('/')   
    }
})
useEffect(()=>{
  getSubCategory()
  getCategory()
},[])
  return (
    <div>
      <Layout>
        <div
          className={`
            ${
            showIcons ? "md:w-[calc(100vw-292px)] w-[calc(100vw-17px)]" : "md:w-[calc(100vw-102px)] w-[calc(100vw-17px)]"
          }
           duration-700  `}
        >
          <div className="flex justify-between flex-wrap gap-4 items-center w-full px-3 sm:px-0">
            <div className="relative">
              <input
                type="search"
                className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
                placeholder="Search..."
                onChange={(e)=>searchCategory(e.target.value)}
              />
            </div>
            <div className="pr-3">
              <button className="bg-[#696cff] border hover:shadow-lg border-[#696cff] text-white py-1 px-3 rounded-md " onClick={()=>setViewAddCategory(true)}>
                Add New
              </button>
            </div>
          </div>

          <div  className={`
            ${
            showIcons ? "md:max-w-[calc(100vw-292px)] " : "md:max-w-[calc(100vw-102px)] "
          }
           duration-700  overflow-hidden pt-5`}>
          <div className={`
            ${
            showIcons ? "md:max-w-[calc(100vw-292px)] " : "md:max-w-[calc(100vw-102px)] "
          }
           duration-700  overflow-auto pb-5`} >
            <table className="  w-full min-w-[1000px]   border">
              <thead>
                <tr className="border font-semibold text-[16px] text-[#696cff]">
                  <th className="border">ID</th>
                  <th className="border">Img</th>
                  <th className="border">CATEGORY</th>
                  <th className="border">SLUG</th>
                  <th className="border">PARENT CATEGORY</th>
                  <th className="border py-2 ">STATUS</th>
                  <th className="border">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  subCategories == false ? 
                  <p className="text-center">Please Wait...</p> :
                  subCategories == "no data" ?
                  <p>No data found</p> :
                  subCategories == "Network" ?
                  <p>Network Error</p> :
                  subCategories.map((category , index)=>(

                <tr className="border hover:bg-white " key={index}>
                  <td className="text-center  border">{category.catId}</td>
                  <td className="text-center  border">
                    <img      src={`${baseUrl}${category.catImg}`} alt="iimg" className="h-[45px] w-[45px] mx-auto" />
                  </td>
                  <td className="text-center  border">{category?.name}</td>
                  <td className="text-center  border">{category?.slugName}</td>
                  <td className="text-center  border">{category?.parentCatId?.name}</td>
                  <td className="text-center  border py-2 "> <button
                      onClick={()=>toggleStatus(category)}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${
                        category?.status == "Active" ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`${
                          category?.status == "Active" ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      />
                    </button></td>
                  
                  <td className="text-center w-[] border">
                   <p className="flex gap-3 w-full justify-center">
                    {/* <IoEyeOutline className="text-[#696cff] text-[20px] cursor-pointer" onClick={()=>{
                      setCurrentCategory(category)
                      setViewCategory(true)
                    }}/> */}
                    <MdOutlineModeEdit className=" text-[20px] cursor-pointer" onClick={()=>{
               
                      setCurrentSubCategory(category)
                      setViewAddCategory(true)
                    }}/>
                    <RiDeleteBin6Line className="text-[red] text-[20px] cursor-pointer" onClick={()=>{
                      setCurrentSubCategory(category)
                      setDeleteBox(true)
                    }}/>
                   </p>
                  </td>
                </tr>
                  ))
                }
              </tbody>
            </table>
            </div>
            
          </div>
        </div>
      </Layout>

      {/*  Add Category */}

      <div className={`${viewAddCategory ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>{
        setViewAddCategory(false)
        clearData()}}>

      </div>

      {viewAddCategory && <ManageSubCategory categories={categories} setViewAddCategory={setViewAddCategory} getSubCategories={getSubCategory} editCategoryData={currentSubCategory} />}

      {/*  View Category */}

      {/* <div className={`${viewCategory ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>setViewCategory(false)}>

      </div>
      <div className={`${viewCategory ? "fixed" : "hidden" } h-[90vh] max-h-[400px] max-w-[450px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}>
          <p className="bg-[#f5f5f9] p-2 text-[#696cff] text-center font-bold fixed w-full  top-0 right-0 ">View Category</p>
          
          <div className=" max-h-[400px] h-[90vh] sidebar overflow-auto pt-[36px]">

          <div className="p-3">
            <p className="font-[500] pb-2">Category Name :</p>
            <input type="text" className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Category name" value={currentCategory ? currentCategory.name : ""} readOnly={true} />
          </div>
          <div className="p-3">
            <p className="font-[500] pb-2">Category Image :</p>
            <input type="file" className="w-full hidden py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" id="categoryImg" onChange={categoryImgFunc}/>
            <div tabIndex="0" className="w-full  py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[150px] flex items-center justify-center overflow-hidden " onClick={()=>document.getElementById('categoryImg').click()}>
                        <p className={`bg-[#f5f5f9] p-2 w-[160px] flex items-center gap-2  rounded-md cursor-pointer ${categoryImg ? "hidden" : ""}`} >
                            <p className="bg-white h-[50px] w-[50px] rounded-md flex items-center justify-center">
                                <IoIosAdd className="text-[40px]"/>
                            </p>
                            <p>Add Image</p>
                        </p>
                        <img src={categoryImg ? URL.createObjectURL(categoryImg) : null} alt="" className={`${categoryImg ? "": "hidden"} max-h-[130px] rounded-md border`}/>
            </div>
            <div className="pt-5">
              
            <button className="bg-[#696cff] w-full text-white p-2 rounded-md hover:font-semibold hover:bg-[#5d60f7]" onClick={createSubCategory}>Save</button>
            </div>
          </div>
          </div>
      </div> */}


      {/*  Edit Category */}

      <div className={`${viewEditCategory ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>{
        setViewEditCategory(false)
        clearData()
        }}>

      </div>
      <div className={`${viewEditCategory ? "fixed" : "hidden" } h-[90vh] max-h-[400px] max-w-[450px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}>
      <p className="bg-[#f5f5f9] p-2 text-[#696cff] text-center font-bold fixed w-full  top-0 right-0 ">Edit Sub Category</p>
          
          <div className=" max-h-[400px] h-[90vh] sidebar overflow-auto pt-[36px]">

          <div className="p-3">
            <p className="font-[500] pb-2">Sub Category Name :</p>
            <input type="text" className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Sub Category name" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} />
          </div>
          <div className="p-3">
            <p className="font-[500] pb-2">Select Parent Category:</p>
           
            <div tabIndex="0" className="w-full  py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[150px]  overflow-auto " >
                        <div>
                            {
                                 categories == false ? 
                                 <p className="text-center">Please Wait...</p> :
                                 categories == "no data" ?
                                 <p>No data found</p> :
                                 categories == "Network" ?
                                 <p>Network Error</p> :
                                 categories.map((category , index)=>(
                                    <p className={`hover:bg-[#696cff] p-[3px] px-3 cursor-pointer hover:text-white ${ currentCategory && category._id == currentCategory._id ? 'bg-[#696cff] text-white' : ""}`} onClick={()=>setCurrentCategory(category)}>{category.name}</p>
                                 ))
                            }
                        </div>
            </div>

            <p className="font-[500] pb-2 pt-3"> Image :</p>
            <input type="file" className="w-full hidden py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" id="categoryImg" onChange={categoryImgFunc}/>
            <div tabIndex="0" className="w-full  py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[150px] flex items-center justify-center overflow-hidden " onClick={()=>document.getElementById('categoryImg').click()}>
                        <p className={`bg-[#f5f5f9] p-2 w-[160px] flex items-center gap-2  rounded-md cursor-pointer ${categoryImg ? "hidden" : ""}`} >
                            <p className="bg-white h-[50px] w-[50px] rounded-md flex items-center justify-center">
                                <IoIosAdd className="text-[40px]"/>
                            </p>
                            <p>Add Image</p>
                        </p>
                        <img src={categoryImg ? URL.createObjectURL(categoryImg) : categoryImgUrl} alt="" className={`${categoryImg ? "": "hidden"} max-h-[130px] rounded-md border`}/>
            </div>
            <div className="pt-5">
              
            <button className="bg-[#696cff] w-full text-white p-2 rounded-md hover:font-semibold hover:bg-[#5d60f7]" onClick={editCategory}>Save</button>
            </div>
          </div>
          </div>
      </div>


      {/*  delete Category */}

      <div className={`${deleteBox ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>setDeleteBox(false)}>

      </div>
      <div className={`${deleteBox ? "fixed" : "hidden" } h-[180px]  max-w-[300px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}>
          <p className="bg-[#f5f5f9] p-2 text-[red] text-center font-bold fixed w-full  top-0 right-0 ">Delete Sub Category</p>


            <p className="pt-[50px] text-center px-5"> Are you sure , you want to delete category</p>

            <p className="flex justify-between px-4 pt-6">
              <button className="p-2 px-4 text-white bg-[#776565] rounded-md" onClick={()=>{
                setDeleteBox(false)
                setCurrentCategory(null)
              }}>Cancel</button>
              <button className="p-2 px-4 text-white bg-[#696cff] rounded-md" onClick={deleteCategory}>Delete</button>
            </p>
          
      </div>
    </div>
  )
}

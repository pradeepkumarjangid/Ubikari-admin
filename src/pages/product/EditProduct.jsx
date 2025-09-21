import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineStarPurple500 } from "react-icons/md";
import noImg from '/img/no-image.png'
import apiObj from "../../services/api";
import { toast } from "react-toastify";
import { SiMaxplanckgesellschaft } from "react-icons/si";
import { useParams } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../../components/custom-editor-styles.css'


export default function EditProduct() {
    const { showIcons, setShowIcons } = useContext(navOpen);
    const {id} = useParams()
    const notifyError = (msg) =>  toast.error(msg)
    const notifySuccess = (msg) => toast.success(msg)
    const [productId , setProductId] = useState(false)
    const [categories , setCategories] = useState(false)
    const [subCategories , setSubCategories] = useState(false)
    const [currentCategory , setCurrentCategory] = useState(false)
    const [currentSubCategory , setCurrentSubCategory] = useState(false)
    const [img1 , setImg1] = useState(false)
    const [img2 , setImg2] = useState(false)
    const [img3 , setImg3] = useState(false)
    const [img4 , setImg4] = useState(false)
    const [img5 , setImg5] = useState(false)
    const [img1Url , setImg1Url] = useState(false)
    const [img2Url , setImg2Url] = useState(false)
    const [img3Url , setImg3Url] = useState(false)
    const [img4Url , setImg4Url] = useState(false)
    const [img5Url , setImg5Url] = useState(false)
    const [name , setName] = useState()
    const [height , setHeight] = useState()
    const [length , setLength] = useState()
    const [breadth , setBreadth] = useState()
    const [status , setStatus] = useState("In Stock")
    const [weight , setWeight] = useState()
    const [qty , setQty] = useState()
    const [discount , setDiscount] = useState(0)
    const [price , setPrice] = useState()
    const [desc , setDesc] = useState()
    const [metal , setMetal] = useState()
    const [purity , setPurity] = useState()
    const [metalWeight , setMetalWeight] = useState()
    const [productId1 ,setProductId1] = useState()
    // reviews
    const[reviews , setReviews]=useState(false)
    const [currentReview , setCurrentReview] = useState(false)
    const [currentReviewRate , setCurrentReviewRate] = useState(5)
    const [currentReviewText , setCurrentReviewText] = useState()

    // delete Review
    const[currentReviewId , setCurrentReviewId]=useState(false)
    const[deleteBox , setDeleteBox]=useState(false)

    let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
    UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
    let headers = {
      Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
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
        console.log(err)
      }
    }

    const getSubCategoryOfACategory = async(id)=>{
      setCurrentSubCategory(false)
      try{
        let result = await apiObj.getSubCategoryOfACategory(id)
        if(result.data.subcategories && result.data.subcategories.length > 0 ){
          setSubCategories(result.data.subcategories)
        }else{
          setSubCategories('no data')
        }
        // console.log(result)
      }catch(err){
        console.log(err)
        if(err.message && err.message == "Network Error"){
          setSubCategories('Network')
        }
        if(err.response && err.response.data.error == "No subcategories found for this category"){
          setSubCategories('no data')
        }
      }
    }

    const editProduct = async()=>{
      console.log(currentSubCategory)
      // return
      let images = [img1 , img2 , img3 , img4 ]
      let data = new FormData()
      data.append("Id" , productId1)
      data.append("name" , name)
      data.append("categoryId" , currentCategory ? currentCategory._id : null)
      data.append("catId" , currentCategory ? currentCategory.catId : null)
      data.append("categoryName" , currentCategory ? currentCategory.name : null)
      data.append("catSlugName" , currentCategory ? currentCategory.slugName : null)

      data.append("description" , desc)
      if(currentSubCategory){
        data.append("subCatName" , currentSubCategory ? currentSubCategory.name : null)
        data.append("subCategoryId" , currentSubCategory ? currentSubCategory._id : null)
        data.append("subCatId" , currentSubCategory ? currentSubCategory.subCatId : null)
        data.append("subCatSlugName" , currentSubCategory ? currentSubCategory.subCatSlugName : null)
      }
      data.append("status" , status)
      data.append("breadth" , +breadth)
      data.append("height" , +height)
      data.append("length" , +length)
      data.append("weight" , +weight)
      data.append("price" , +price)
      data.append("discount" , +discount)
      data.append("stock" , +qty)
      data.append("metalType" , metal)
      // data.append("metalWeight" , metalWeight)
      // data.append("purity" , purity)
      data.append("image1" , img1)
      data.append("image2" , img2)
      data.append("image3" , img3)
      data.append("image4" , img4)
      data.append("image5" , img5)
      console.log(images)
      if(!currentCategory){
        notifyError('Please select Category')
      }else if(!name){
        notifyError('Please enter Product Name')
      }else if(!productId){
        notifyError('Please enter product ID')
      }      else if(!currentCategory){
        notifyError('Please select category')
      }else if(!length){
        notifyError('Please enter product length')
      }else if(!height){
        notifyError('Please enter product height')
      }else if(!breadth){
        notifyError('Please enter product breadth')
      }else if(!weight){
        notifyError('Please enter product weight')
      }else if(!price){
        notifyError('Please enter product price')
      }else{
        try{
          let result = await apiObj.editProduct(productId ,data , headers)
          console.log(result)
          notifySuccess('Product Updated successfully')
          window.history.back()
        }catch(err){
          console.log(err)
        }
      }
    }
    const getSingleProduct = async()=>{
        console.log('hii')
        try{
            let result = await apiObj.getSingleProduct(id , headers)
            console.log(result)
            if(result.data.product){
                let data = result.data.product 
                getSubCategoryOfACategory(data.categoryId)
                setCurrentCategory({_id : data.categoryId , name : data.categoryName , slugName : data.catSlugName , catId : data.catId })
                if(data.subCategoryId && data.subCatSlugName){

                  setCurrentSubCategory({_id : data.subCategoryId , name : data.subCategoryName , subCatSlugName : data.subCatSlugName , subCatId : data.subCatId , })
                }else{
                  setCurrentSubCategory(false)
                }
                setDiscount(data.discount)
                setDesc(data.description)
                setProductId(data._id)
                setProductId1(data.Id)
                setHeight(data.height)
                setBreadth(data.breadth)
                setLength(data.length)
                setWeight(data.weight)
                // setPurity(data.purity)
                setMetal(data.metalType)
                // setMetalWeight(data.metalWeight)
                setName(data.name)
                setPrice(data.price)
                setQty(data.stock)
                setImg1Url(data.imageUrl1)
                setImg2Url(data.imageUrl2)
                setImg3Url(data.imageUrl3)
                setImg4Url(data.imageUrl4)
                setImg5Url(data.imageUrl5)
                if(data.reviews && data.reviews.length > 0){
                  setReviews(data.reviews)
                }else{
                  setReviews(false)
                }
                
            }
        }catch(err){
            console.log(err)
        }
    }
    const handleEditorChange = (event, editor) => {
      const data = editor.getData();
      setDesc(data);
    };

    const editReview = async()=>{
      if(currentReview){
        try{
          let data = new FormData()
          data.append("rating" , +currentReviewRate )
          data.append("reviewText" , currentReviewText )

          let result = await apiObj.editReview(currentReview._id , data , headers)
          console.log(result)
          getSingleProduct()
          notifySuccess(result.data.message)
          setCurrentReview(false)
        }catch(err){
          console.log(err)
        }
      }
    }
    const deleteReview = async()=>{
      if(currentReviewId){
        try{
          let id = currentReviewId ? currentReviewId : ""
          let result = apiObj.deleteReview(id , headers)
          console.log(result)
        }catch(err){
          console.log(err)
        }
      }
      console.log('delete')
    }
    useEffect(()=>{
      getCategory()
      getSingleProduct()
      // getSubCategoryOfACategory()
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
       
       <div className="p-8 w-full bg-gray-100 min-h-screen">
      <div className=" mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Product</h2> */}
        
        {/* <div>
            <label className="block text-sm font-medium text-gray-700 ">Select Category <span className="text-[red]">*</span></label>
            <div type="text" className="mt-1 p-2 block  border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[120px] sm:w-[49%] overflow-auto px-4" >
              {
                categories == false ?
                <p className={` cursor-pointer px-3 text-center`}>Please wait...</p> : 
                categories == "no data" ?
                <p className={` px-3 text-center`}>Please add category</p> :
                categories.map((category , index)=>(
                  <p className={`${currentCategory && currentCategory._id == category._id ? "bg-[#696cff] text-white" : ""}  cursor-pointer px-3`} key={index} onClick={()=>setCurrentCategory(category)}>{category.name}</p>
                ))
              }
                
                
               </div>
          </div> */}
          <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 gap-4 w-full">
        <div>
            <label className="block text-sm font-medium text-gray-700 ">Select Category <span className="text-[red]">*</span></label>
            <div type="text" className="mt-1 p-2 block  border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[120px]  overflow-auto px-4" >
              {
                categories == false ?
                <p className={` cursor-pointer px-3 text-center`}>Please wait...</p> : 
                categories == "no data" ?
                <p className={` px-3 text-center`}>Please add category</p> :
                categories == "Network" ?
                  <p>Network Error</p> :
                categories.map((category , index)=>(
                  <p className={`${currentCategory && currentCategory._id == category._id ? "bg-[#696cff] text-white" : ""}  cursor-pointer px-3`} key={index} onClick={()=>{
                    getSubCategoryOfACategory(category._id)
                    setCurrentCategory(category)}
                  }>{category.name}</p>
                ))
              }
                
                
               </div>
          </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 ">Select Sub Category <span className="text-[red]">*</span></label>
            <div type="text" className="mt-1 p-2 block  border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[120px]  overflow-auto px-4" >
              {
                subCategories == false ?
                <p className={` cursor-pointer px-3 text-center`}>First please select  category</p> : 
                subCategories == "no data" ?
                <p className={` px-3 text-center`}>No Sub Categories</p> :
                subCategories == "Network" ?
                  <p>Network Error</p> :
                  subCategories.map((category , index)=>(
                  <p className={`${currentSubCategory && currentSubCategory._id == category._id ? "bg-[#696cff] text-white" : ""}  cursor-pointer px-3`} key={index} onClick={()=>setCurrentSubCategory(category)}>{category.name}</p>
                ))
              }
                
                
               </div>
          </div>
          </div>
        <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 gap-4 w-full">
          {/* Left Column */}
          <div>
            <label className="block text-sm font-medium text-gray-700 ">Product ID<span className="text-[red]">*</span></label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Product ID" value={productId1} onChange={(e)=>setProductId1(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 ">Product Name <span className="text-[red]">*</span></label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>


          {/* Dimensions */}
        
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Breadth (cm) <span className="text-[red]">*</span></label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Breadth" value={breadth} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setBreadth(e.target.value)
              }else{
                notifyError("Please input only number")
              }
             
              }}/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm) <span className="text-[red]">*</span></label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Height" value={height} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setHeight(e.target.value)
              }else{
                notifyError("Please input only number")
              }
             
              }}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Length (cm) <span className="text-[red]">*</span></label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Length" value={length} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setLength(e.target.value)
              }else{
                notifyError("Please input only number")
              }
             
              }}/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg) <span className="text-[red]">*</span></label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Weight (kg)" value={weight} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setWeight(e.target.value)
              }else{
                notifyError("Please input only number")
              }
             
              }}/>
          </div>

          {/* Discount and Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price <span className="text-[red]">*</span></label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Price" value={price} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setPrice(e.target.value)
              }else{
                notifyError("Please input only number")
              }
              
              }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Discount (%)" value={discount} onChange={(e)=>{
                if(!isNaN(e.target.value)){
                  setDiscount(e.target.value)
                }else{
                  notifyError("Please input only number")
                }
              
            }}/>
          </div>

         

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value={"In Stock"}>In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          
          

          <div>
            <label className="block text-sm font-medium text-gray-700">Qty</label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Quantity" value={qty} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setQty(e.target.value)
              }else{
                notifyError("Please input only number")
              }
              
              }} />
          </div>

          {/* Metal  */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Metal</label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" value={metal} onChange={(e)=>setMetal(e.target.value)}>
              
            </input>
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Purity / Karat</label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Purity / Karat"  value={purity} onChange={(e)=>setPurity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Metal Weight (grm)</label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Metal Weight (grm)" value={metalWeight} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setMetalWeight(e.target.value)
              }else{
                notifyError("Please input only number")
              }
              
              }} />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Images</label>
            <div className="p-1 flex gap-3 ">
              {/* img1 */}
              <div className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden" onClick={()=>document.getElementById('img1').click()}>
                    <input type="file" className="hidden" id="img1" onChange={(e)=>e.target.files[0] && e.target.files[0] instanceof Blob ? setImg1(e.target.files[0]) : setImg1(false)}/>
                      <img src={img1  ? URL.createObjectURL(img1) : img1Url ? img1Url : noImg} alt="" className="h-[45px] w-[45px]" /> 
              </div>
              {/* img2 */}
              <div className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden" onClick={()=>document.getElementById('img2').click()}>
                    <input type="file" className="hidden" id="img2" onChange={(e)=>e.target.files[0] && e.target.files[0] instanceof Blob ? setImg2(e.target.files[0]) : setImg2(false)}/>
                      <img src={img2 ? URL.createObjectURL(img2) : img2Url ? img2Url : noImg} alt="" className="h-[45px] w-[45px]" /> 
              </div>
              {/* img3 */}
              <div className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden" onClick={()=>document.getElementById('img3').click()}>
                    <input type="file" className="hidden" id="img3" onChange={(e)=>e.target.files[0] && e.target.files[0] instanceof Blob  ? setImg3(e.target.files[0]) : setImg3(false)}/>
                      <img src={img3 ? URL.createObjectURL(img3) : img3Url ? img3Url : noImg} alt="" className="h-[45px] w-[45px]" /> 
              </div>
              {/* img4 */}
              <div className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden" onClick={()=>document.getElementById('img4').click()}>
                    <input type="file" className="hidden" id="img4" onChange={(e)=>e.target.files[0] && e.target.files[0] instanceof Blob ? setImg4(e.target.files[0]) : setImg4(false)}/>
                      <img src={img4 ? URL.createObjectURL(img4) : img4Url ? img4Url : noImg} alt="" className="h-[45px] w-[45px]" /> 
              </div>
              {/* img5 */}
              <div className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden" onClick={()=>document.getElementById('img5').click()}>
                    <input type="file" className="hidden" id="img5" onChange={(e)=>e.target.files[0] && e.target.files[0] instanceof Blob ? setImg5(e.target.files[0]) : setImg5(false)}/>
                      <img src={img5 ? URL.createObjectURL(img5) : img5Url ? img5Url : noImg} alt="" className="h-[45px] w-[45px]" /> 
              </div>
            </div>
          </div>
          
       
        </div>
        
        
             {/* Short Description */}
             <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
       
        </div>
      
        <CKEditor
      className="ck-editor__editable_inline"
        editor={ClassicEditor}
        data={desc}
        config={{
            extraPlugins: [function (editor) {
              editor.on('ready', () => {
                editor.editing.view.change(writer => {
                  writer.setStyle('padding', '20px', editor.editing.view.document.getRoot());
                });
              });
            }],
          }}
        onChange={handleEditorChange}
      />

        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={editProduct}>Save</button>
        </div>

            {/* reviews */}
      <div className={`${reviews ? "block" : 'hidden'}`}>
          <p className="text-center text-[26px] font-semibold py-3">Reviews</p>

          <div className="flex flex-wrap">
            {
              reviews && reviews.map((item , index)=>(
                <div className="md:w-[50%] w-full p-4 pb-2  ">
                <div className="border rounded-md p-2 border-[#696cff]">
                  <p className="pb-2">{item.userName}</p>

                  {
                    currentReview && currentReview._id == item._id ? 
                  <div >

                  <div className='text-[30px] flex items-center gap-2  border-b pb-1'>
                        <MdOutlineStarPurple500 className={`${currentReviewRate> 0 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setCurrentReviewRate(1)}/>
                        <MdOutlineStarPurple500 className={`${currentReviewRate > 1 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setCurrentReviewRate(2)}/>
                        <MdOutlineStarPurple500 className={`${currentReviewRate > 2 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setCurrentReviewRate(3)}/>
                        <MdOutlineStarPurple500 className={`${currentReviewRate > 3 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setCurrentReviewRate(4)}/>
                        <MdOutlineStarPurple500 className={`${currentReviewRate > 4 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setCurrentReviewRate(5)}/>
                        
                        <p className={`${currentReviewRate == 1 ? "text-[#ff6161]" : currentReviewRate == 2 ? "text-[#ff9f00]" :  'text-[#388e3c]' } text-[14px] font-semibold pt-1`}>{currentReviewRate == 1 ? "Very Bad" : currentReviewRate == 2 ? "Bad" : currentReviewRate == 3  ? 'Good' : currentReviewRate == 4 ? "Very Good" : currentReviewRate == 5 ? "Excellent" : null}</p>
                    </div>

                    <div>
                        <textarea name="" id=""  className='border block max-w-full w-full min-h-[100px] p-2 py-1 focus:outline-[#696cff] '  placeholder='write some review' value={currentReviewText} onChange={(e)=>setCurrentReviewText(e.target.value)}></textarea>
                    </div>

                    <div className="py-3 pb-2 flex justify-between">
                  <p>
                    {item.date.slice(0,10)}
                  </p>
                  <button className="bg-[#696cff] border-white rounded-md px-3 py-1 text-white" onClick={editReview}>Save</button>
                </div>
                  </div> : 
                   <div >

                   <div className='text-[30px] flex items-center gap-2  border-b pb-1'>
                         <MdOutlineStarPurple500 className={`${item.rating > 0 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setStarNo(1)}/>
                         <MdOutlineStarPurple500 className={`${item.rating > 1 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setStarNo(2)}/>
                         <MdOutlineStarPurple500 className={`${item.rating > 2 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setStarNo(3)}/>
                         <MdOutlineStarPurple500 className={`${item.rating > 3 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setStarNo(4)}/>
                         <MdOutlineStarPurple500 className={`${item.rating > 4 ? "text-[#ffe11b]" : "text-[#e0e0e0]" } cursor-pointer `} onClick={()=>setStarNo(5)}/>
                         
                         <p className={`${item.rating == 1 ? "text-[#ff6161]" : item.rating == 2 ? "text-[#ff9f00]" :  'text-[#388e3c]' } text-[14px] font-semibold pt-1`}>{item.rating == 1 ? "Very Bad" : item.rating == 2 ? "Bad" : item.rating == 3  ? 'Good' : item.rating == 4 ? "Very Good" : item.rating == 5 ? "Excellent" : null}</p>
                     </div>
 
                     <div>
                         <textarea name="" id=""  className='border block max-w-full w-full min-h-[100px] focus:outline-[#696cff] p-2 py-1 ' readOnly={true} placeholder='write some review' value={item.reviewText}></textarea>
                     </div>

                     <div className="py-3 pb-2 flex justify-between">
                  <p>
                    {item.date.slice(0,10)}
                  </p>
                  <div>

                  <button className="bg-[red] mx-3 border-white rounded-md px-3 py-1 text-white" onClick={()=>{
                      setCurrentReviewId(item._id)
                      setDeleteBox(true)
                    }}>Delete</button>
                  <button className="bg-[#696cff] border-white rounded-md px-3 py-1 text-white" onClick={()=>{
                    setCurrentReview(item)
                    setCurrentReviewRate(item.rating)
                    setCurrentReviewText(item.reviewText)
                    }}>Edit</button>
                  </div>
                </div>
                   </div>
                  }


                
                    
                </div>
            </div>
              ))
            }
           
          </div>
      </div>

      {/* deleteReview */}

      <div className={`${deleteBox ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>setDeleteBox(false)}>

</div>
<div className={`${deleteBox ? "fixed" : "hidden" } h-[180px]  max-w-[300px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}>
    <p className="bg-[#f5f5f9] p-2 text-[red] text-center font-bold fixed w-full  top-0 right-0 ">Delete Product</p>


      <p className="pt-[50px] text-center px-5"> Are you sure , you want to delete this Review</p>

      <p className="flex justify-between px-4 pt-6">
        <button className="p-2 px-4 text-white bg-[#776565] rounded-md" onClick={()=>{
          setDeleteBox(false)
          setCurrentReviewId(null)
        }}>Cancel</button>
        <button className="p-2 px-4 text-white bg-[#696cff] rounded-md" onClick={deleteReview}>Delete</button>
      </p>
    
</div>

      </div>
    </div>

        
      </div>
    </Layout>
  </div>
  )
}

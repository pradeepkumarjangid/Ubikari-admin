import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { FaFileExcel } from "react-icons/fa";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Products() {
  let navigate = useNavigate()
  const notifyError = (msg) =>  toast.error(msg)
    const notifySuccess = (msg) => toast.success(msg)
    const { showIcons, setShowIcons } = useContext(navOpen);
  const [status, setStatus] = useState(true);
  const [products, setProducts] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(false);
  const[deleteBox , setDeleteBox]= useState(false)
  const [selectedItems, setSelectedItems] = useState([]);
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

  const getProducts = async()=>{
    try{
      let result = await apiObj.getProducts(headers)
      if(result.data.products && result.data.products.length > 0 ){
        setProducts(result.data.products)
      }else{
        setProducts('no data')
      }
      console.log(result)
    }catch(err){
      console.log(err)
      if(err.message && err.message == "Network Error"){
        setProducts('Network')
      }
    }
  }
  const searchProducts = async(query)=>{
    if(query.length > 0){

      try{
        let result = await apiObj.searchProduct(query , headers)
        if(result.data.products && result.data.products.length > 0 ){
          setProducts(result.data.products)
        }else{
          setProducts('no data')
        }
        console.log(result)
      }catch(err){
        console.log(err)
      }
    }
  }
  const deleteProduct = async()=>{
    let id = currentProduct ? currentProduct._id : null
    try{
      let result = await apiObj.deleteProduct(id , headers)
      // if(result.data.products && result.data.products.length > 0 ){
      //   setProducts(result.data.products)
      // }else{
      //   setProducts('no data')
      // }
      notifySuccess("Product deleted successfully")
      getProducts()
      setDeleteBox(false)
      setCurrentProduct(false)
      console.log(result)
    }catch(err){
      console.log(err)
    }
  }

  
  const editProduct = async(product)=>{
    let data = new FormData()
    data.append("activeStatus" , product.activeStatus == "Active" ? "InActive" : "Active")
    // activeStatus == "Active"
    console.log(product.activeStatus)
   
      try{
        let result = await apiObj.editProduct(product._id ,data , headers)
        console.log(result)
        notifySuccess('Product Status Updated ')
        getProducts()
        // console.log(selectedItems)
        // window.history.back()
      }catch(err){
        console.log(err)
      }
    
  }

  useEffect(()=>{
    getProducts()
  },[])

  useEffect(()=>{
    if(!localStorage.getItem('UNIKARIADMIN')){
        navigate('/')   
    }
})

const flattenData = (data) => {
  const rows = [];

  data.forEach(item => {
      rows.push({
        "Product Id" : item.Id,
        "Product Name" : item.name ,
        'Category Name': item.categoryName,
        'Category Slug Name' : item.catSlugName ,
        'SubCategory Name' : item.subCatName ,
        'SubCategory Slug Name' : item.subCatSlugName ,
        'Product Weight' : item.weight ,
        'Price' : item.price ,
        'Discount' : item.discount ,
        'Status' : item.status ,
        'Qnty' : item.stock,
        'Metal' : item.metalType,
        'Description' : item.description,
        "Product Breadth" : item.breadth ,
        'Product Height':item.height,
        'Product Length':item.length,
        "ActiveStatus" : item.activeStatus
      });
    });

  return rows;
};

 const exportToExcel = () => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
 
 //  let data2 = JSON.parse(data)
  console.log(flattenData(products))
  // Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(flattenData(products));

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Unikari Products');

  // Write the workbook and trigger a download
  XLSX.writeFile(workbook, 'Unikari Products.xlsx');
};
  // Handle checkbox change
  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      // Remove item if already selected
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    } else {
      // Add item if not selected
      setSelectedItems([...selectedItems, item]);
    }
  };
  const downloadPDF = () => {
    const element = document.getElementById("quotation");
    
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth(); // Width of A4 in mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // Height of A4 in mm
  
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth; // Scale the image height proportionally to fit width
      let heightLeft = imgHeight;
  
      let position = 0;
  
      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
  
      // Handle overflow and add pages
      while (heightLeft > 0) {
        position -= pdfHeight; // Move to the next page
        pdf.addPage(); // Add a new page
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save("quotation.pdf");
    });
  };

  const convertImageToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Resolve Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Convert blob to Base64
      });
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };

  // Handle Button Click to Convert and Show Image
  const handleConvertImage = async () => {
    const base64 = await convertImageToBase64("https://api.unikari.com/uploads/1733292658217_a29c26f4.png");
    console.log(base64)
    return base64 ; // Update state with Base64 string
  };
  useEffect(()=>{
    handleConvertImage()
  })


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
          <div className="flex justify-between flex-wrap gap-4 px-2 items-center w-full">
            <div className="relative ">
              <input
                type="search"
                className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
                placeholder="Search..."
                onChange={(e)=>searchProducts(e.target.value)}
              />
            </div>
            <div className="pr-3 flex gap-2 items-center">
              <button className="bg-[#696cff] border hover:shadow-lg border-[#696cff] text-white py-1 px-3 rounded-md " onClick={downloadPDF}>
              Catalogue
              </button>
              <button className="bg-[#696cff] border hover:shadow-lg border-[#696cff] text-white py-1 px-3 rounded-md " onClick={()=>navigate('/add-product')}>
                Add New
              </button>
              <FaFileExcel className="text-[#217346] text-[24px] cursor-pointer" onClick={exportToExcel} />
            </div>
          </div>

          <div className="py-5 max-w-[100vw] overflow-hidden ">
            <div className="overflow-auto">
            <table className="w-full min-w-[700px]  border ">
              <thead>
                <tr className="border p-2 font-semibold text-[16px] text-[#696cff]">
                  <th className="border"></th>
                  <th className="border">ID</th>
                  <th className="border">IMG</th>
                  <th className="border">PRODUCT NAME</th>
                  <th className="border">CATEGORY</th>
                  <th className="border">QTY</th>
                  <th className="border p-2">STATUS</th>
                  <th className="border">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  products == false ?
                  <p>Please wait...</p> :
                  products == "no data" ?
                  <p>No data found</p> :
                  products == "Network" ?
                  <p>Network Error</p> :
                  products.map((product , index)=>(

                <tr className="border p-2 hover:bg-white" key={index} onClick={() => handleCheckboxChange(product)}>
                  <td className="text-center  border"><input
              type="checkbox"
              value={product}
              checked={selectedItems.includes(product)}
              onChange={() => handleCheckboxChange(product)}
            /></td>
                  <td className="text-center  border">{product.Id}</td>
                  <td className="text-center min-w-[40px]  flex justify-center  border">
                    <img src={product.imageUrl1} className="h-[40px] w-[40px] rounded-md" alt="iimg" />
                  </td>
                  <td className="text-left px-2  border">{product.name}</td>
                  <td className="text-center min-w-[120px] border">{product.categoryName}</td>
                  <td className="text-center min-w-[120px] border">{product.stock}</td>
                  <td className="text-center min-w-[120px] border p-2"> <button
                      onClick={(e)=>{
                        e.stopPropagation()
                        editProduct(product)
                      }}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${
                        product.activeStatus == "Active" ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`${
                          product.activeStatus == "Active" ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      />
                    </button></td>
                  <td className="text-center min-w-[120px] border">
                   <p className="flex gap-3 w-full justify-center">
                    {/* <IoEyeOutline className="text-[#696cff] text-[20px] cursor-pointer"/> */}
                    <MdOutlineModeEdit className=" text-[20px] cursor-pointer" onClick={(e)=>{
                       e.stopPropagation()
                      navigate(`/edit-product/${product.Id}`)
                      }}/>
                    <RiDeleteBin6Line className="text-[red] text-[20px] cursor-pointer" onClick={(e)=>{
                       e.stopPropagation()
                      setCurrentProduct(product)
                      setDeleteBox(true)
                    }} />
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


       {/*  delete Category */}

       <div className={`${deleteBox ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>setDeleteBox(false)}>

</div>
<div className={`${deleteBox ? "fixed" : "hidden" } h-[180px]  max-w-[300px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}>
    <p className="bg-[#f5f5f9] p-2 text-[red] text-center font-bold fixed w-full  top-0 right-0 ">Delete Product</p>


      <p className="pt-[50px] text-center px-5"> Are you sure , you want to delete product</p>

      <p className="flex justify-between px-4 pt-6">
        <button className="p-2 px-4 text-white bg-[#776565] rounded-md" onClick={()=>{
          setDeleteBox(false)
          setCurrentProduct(null)
        }}>Cancel</button>
        <button className="p-2 px-4 text-white bg-[#696cff] rounded-md" onClick={deleteProduct}>Delete</button>
      </p>
    
</div>



        {/* pdf data*/}
        <div className="z-50">
      <h1>Quotation</h1>
      <p>Date: {new Date().toLocaleDateString()}</p>
      <div id="quotation" style={{ padding: "20px", border: "1px solid #ddd" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>S.No.</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Style No.</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Img</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Base Metal</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gold Plating</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price per Pcs (₹)</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.Id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}><img src={item.imageUrl1} className="w-[130px] h-[130px] mx-auto" /></td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.metalType}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.plating}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   
    </div>
    </div>
  )
}

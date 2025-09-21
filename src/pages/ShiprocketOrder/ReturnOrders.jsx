import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiFileDownloadLine } from "react-icons/ri";
import { IoIosMore } from "react-icons/io";
import { GrFormNextLink , GrFormPreviousLink  } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";

export default function ReturnOrders() {
  let navigate = useNavigate()
  const notifyError = (msg) =>  toast.error(msg)
    const notifySuccess = (msg) => toast.success(msg)
    const { showIcons, setShowIcons } = useContext(navOpen);
  const [status, setStatus] = useState(true);
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [breadth, setBreadth] = useState();
  const [length, setLength] = useState();
  const [orders, setOrders] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const[deleteBox , setDeleteBox]= useState(false)
  const[editOrder , setEditOrder]= useState(false)
  const[filter , setFilter]= useState("ALL")
  const[currentPage , setCurrentPage] = useState(1)
  const[itemsPerPage , setItemsPerPage] = useState(10)
  const[totalOrders , setTotalOrders] = useState(0)
  const today = new Date().toISOString().split("T")[0];
  const nextDay = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  let[fromDate , setFromDate] = useState(today)
  let[toDate , setToDate] = useState(nextDay)
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };
 
 
  const getOrders = async(page , items)=>{
    setOrders(false)
    try{
      let result = await apiObj.getAllReturnOrder( fromDate ,toDate ,  page , items, "All",headers)
      console.log(result)
      if(result.data.orders && result.data.orders.length > 0 ){
        setTotalOrders(result.data.totalOrders)
        setOrders(result.data.orders)
      }else{
        setOrders('no data')
      }
    }catch(err){
      console.log(err)
      if(err.message && err.message == "Network Error"){
        setOrders('Network')
      }
    }
  }
  const searchOrder = async(query)=>{
    if(query.length > 0){

      try{
        let result = await apiObj.searchOrder(query , headers)
        if(result.data.data && result.data.data.length > 0 ){
          setOrders(result.data.data)
        }else{
          setOrders('no data')
        }
        console.log(result)
      }catch(err){
        console.log(err)
        if(err.response){
          if(err.response.data.message == "No orders found"){
            setOrders('no data')
          }
        }
      }
    }else{
      getOrders()
    }
  }
  const deleteOrder = async()=>{
    let id = currentOrder ? currentOrder._id : null
    try{
      let result = await apiObj.deleteOrder(id , headers)
     
      notifySuccess("Order deleted successfully")
      getOrders()
      setDeleteBox(false)
      setCurrentProduct(false)
      console.log(result)
    }catch(err){
      console.log(err)
      if(err.response && err.response.data.message){
        notifyError(err.response.data.message)
       
      }
    }
  }
  const editOrderFunc = async()=>{
      let orderItems = []
      console.log(currentOrder)
      if(currentOrder){
        currentOrder.orderItems.forEach(order=>{
          orderItems = [...orderItems , {
            name : order.productName ,
            sku : order.productId.Id ,
            units : order.qnty ,
            selling_price : order.productPriceAfterDiscount ,
          }]
        })
      }
      let data = {
        
          "order_id": currentOrder ? currentOrder.shiprocketDetails.channel_order_id : "",
          "order_date": currentOrder ? currentOrder.shiprocketDetails.created_at : "",
          "pickup_location": "work",
          "billing_address": currentOrder ? currentOrder.shiprocketDetails.customer_address : "",
          // "shipping_address": "adarsh colony",
          
          // "billing_customer_name": currentOrder ? currentOrder.shiprocketDetails.billing_customer_name : "",
          "billing_customer_name": currentOrder ? currentOrder.shiprocketDetails.customer_name : "",
          "billing_last_name":  "",
          "billing_city": currentOrder ? currentOrder.shiprocketDetails.customer_city : "",
          "billing_state": currentOrder ? currentOrder.shiprocketDetails.customer_state : "",
          "billing_pincode": currentOrder ? currentOrder.shiprocketDetails.customer_pincode : "",
          "billing_country": currentOrder ? currentOrder.shiprocketDetails.customer_country : "",
          "billing_phone": currentOrder ? currentOrder.shiprocketDetails.customer_phone : "",
          "billing_email": currentOrder ? currentOrder.shiprocketDetails.customer_email : "",
          "shipping_is_billing": true,
          "payment_method": currentOrder ? currentOrder.shiprocketDetails.payment_method : "",
          "sub_total": currentOrder ? currentOrder.sub_total : "",
          "total_discount": currentOrder ? currentOrder.shiprocketDetails.discount : "",
          "invoice_number": currentOrder ? currentOrder.shiprocketDetails.invoice_no : "",
          "shipping_charges": currentOrder ? currentOrder.shipping_charges : "",
          "weight": +weight,
          "height": +height,
          "breadth": +breadth,
          "length": +length,
          "order_items": orderItems,
        }
      console.log(data)
      console.log(currentOrder)
      // return
      try{
    
        let result = await apiObj.editShipmentOrder(  data , headers)
        console.log(result)
        notifySuccess('Order Updated ')
        setEditOrder(false)
        setCurrentOrder(false)
        getOrders()
      
      }catch(err){
        if(err.response && err.response.data.error == " Request is not authorized"){
          notifyError('Please Login Again')
          localStorage.removeItem('UNIKARIADMIN')
          navigate('/')
        }
        console.log(err)
      }

    
  }
  const createShipment = async(shipmentId , courierId)=>{
    let data = {
      "shipment_id": shipmentId,
      "courier_id" : courierId
  }
  // return
  try{
      let result = await apiObj.generateAWBReturnOrder(data , headers)
      getOrders(currentPage , itemsPerPage)
      notifySuccess('Order shipped sccessfully')
      console.log(result)
  }catch{err}{
    console.log(err)
  }
  console.log(data)
  }

  const cancelShipment = async(aws , orderId)=>{
    let data = {
        "awbs": [aws],
        "order_id" : [orderId]
      } 
      try{
        let result = await apiObj.cancelShipment(data ,headers)
        getOrders()
        setDeleteBox(false)
    notifySuccess("Order Cancelled Successfully ")
        console.log(result)
      }catch(err){
        notifyError("Tyr again after some time ")
        console.log(err)
      }
}
const cancelOrder = async(orderId)=>{
  console.log(currentOrder)
    let data = {
        "order_id" : [currentOrder?.id]
      } 
      try{
        let result = await apiObj.cancelReturnOrder(data,headers)
        console.log(result)
        getOrders()
        setDeleteBox(false)
    notifySuccess("Order Cancelled Successfully ")
       
      }catch(err){
        notifyError(err?.response?.data?.error || err?.response?.data?.message || err?.message)
        console.log(err)
      }
}
  function formatDate(dateString) {
    const date = new Date(dateString);
    
    const options = {
        month: 'short', // "Oct"
        day: '2-digit', // "27"
        year: 'numeric', // "2024"
        hour: '2-digit', // "01"
        minute: '2-digit', // "17"
        hour12: true     // "AM" or "PM"
    };
    
    // Convert the date to desired format
    return date.toLocaleString('en-US', options).replace(',', '');
}
const downloadInvoice = async(order_id) => {
  if(order_id){
      let data = {
              orderId : [order_id ]
      }
      try{
         let result =  await apiObj.downloadInvoice(data , headers)
         console.log(result)
         const anchor = document.createElement('a');
anchor.href = result.data.invoice_url; // Set the URL
//   anchor.target = '_blank'; // Open in a new tab
anchor.download = "invoice"; // Set the file name

// Append the anchor to the document body
document.body.appendChild(anchor);

// Trigger click to start download
anchor.click();

// Remove the anchor from the document
document.body.removeChild(anchor);
      }catch(err){
          console.log(err)
      }
  }
 
};
const downloadLabel = async(shipmentId) => {
  if(shipmentId){
      let data = {
              shipment_id : [shipmentId ]
      }
      try{
         let result =  await apiObj.downloadLabel(data , headers)
         console.log(result)
         const anchor = document.createElement('a');
anchor.href = result.data.label_url; // Set the URL
//   anchor.target = '_blank'; // Open in a new tab
anchor.download = "invoice"; // Set the file name

// Append the anchor to the document body
document.body.appendChild(anchor);

// Trigger click to start download
anchor.click();

// Remove the anchor from the document
document.body.removeChild(anchor);
      }catch(err){
          console.log(err)
      }
  }
 
};
  useEffect(()=>{
    getOrders(currentPage , itemsPerPage)
  },[])
  useEffect(()=>{
    if(!localStorage.getItem('UNIKARIADMIN')){
        navigate('/')   
    }
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
        <div className="p-4 py-2 bg-white shadow-md rounded-lg flex items-center gap-4">
      <label className="text-gray-600">From:</label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border p-2 rounded-md"
      />

      <label className="text-gray-600">To:</label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border p-2 rounded-md"
      />

<button
        onClick={() => getOrders(currentPage , itemsPerPage)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Find
      </button>
    </div>
          {/* <div className="relative ">
            <input
              type="search"
              className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
              placeholder="Search..."
              onChange={(e)=>searchOrder(e.target.value)}
            />
          </div> */}
          <div className="flex justify-end px-3 pb-4">
          
          <select name="" id="" className="text-center py-1 border border-[#696cff] rounded-md focus:outline-none" value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option value="ALL">ALL</option>
            <option value="RETURN PENDING">RETURN PENDING</option>
            <option value="RETURN CANCELLED">RETURN CANCELLED</option>
            {/* <option value="DELIVERED">DELIVERED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="CANCELLATION REQUESTED">CANCELLATION REQUESTED</option>
            <option value="CANCELED">CANCELED</option> */}
          </select>
          </div>
          
        </div>

        <div className="pt-5 max-w-[100vw] overflow-hidden ">

          {/* <div className="flex justify-end px-3 pb-4">
          
          <select name="" id="" className="text-center py-1 border border-[#696cff] rounded-md focus:outline-none" value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option value="ALL">ALL</option>
            <option value="READY TO SHIP">READY TO SHIP</option>
            <option value="OUT FOR PICKUP">OUT FOR PICKUP</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="CANCELLATION REQUESTED">CANCELLATION REQUESTED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
          </div> */}
          <div className="overflow-auto">
          <table className="w-full min-w-[950px]   border">
            <thead>
              <tr className="border p-2 font-semibold text-[16px] text-[#696cff]">
                <th className="border">ID</th>
                {/* <th className="border">Our ID</th> */}
          
                <th className="border">CUSTOMER</th>
                <th className="border">AMOUNT</th>
                <th className="border">REASON</th>
                <th className="border">SHIPPING DETAILS</th>
                <th className="border">ORDER DATE</th>
                {/* <th className="border">ESTIMATE DELIVERY </th> */}
                <th className="border p-2">STATUS</th>
                <th className="border">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                orders == false ?
                <p>Please wait...</p> :
                orders == "no data" ?
                <p>No data found</p> :
                orders == "Network" ?
                <p>Network Error</p> :
                orders.map((order , index)=>(

              <tr className={`border p-2 hover:bg-white ${ order.status == filter || filter == "ALL" ? '' : 'hidden'} `} key={index} onClick={()=>navigate(`/view-order/${order?.id}`)}>
                {/* <td className="text-center  border">{order.shiprocketDetails?.id || order?.order_id}</td> */}
                <td className="text-center  border">{order?.id}</td>
                
                <td className="text-center  border">{order.pickup_person_name} <br />{order.pickup_person_phone} </td>
                <td className="text-center w-[] border">
                  {order?.refund_amount?.toFixed(2)}
                  {/* 00 */}
                  <br />
                  <p className={` flex justify-center gap-2 ${order?.cod ? "text-[red]" : "text-[green]"} text-[13px]`}>

                  {order?.cod ? "COD" : "Prepaid"} 
                   <span>

                   {order?.shiprocketDetails?.awb_data && order.shiprocketDetails?.awb_data.charges ? order?.shiprocketDetails?.awb_data.charges?.freight_charges : null }
                   </span>
                  </p>
                </td>
                <td className="text-center  border">{order.return_reason}</td>
                <td className="text-center w-[] border">
                  {order?.shiprocketDetails?.shipments[0]?.courier} <br />
                  {order?.shiprocketDetails?.shipments[0]?.awb} <br />
                  { order?.shiprocketDetails?.status == "CANCELED" || order?.shiprocketDetails?.status == "CANCELLATION REQUESTED" || order?.shiprocketDetails?.status == 'INVOICED' || order?.shiprocketDetails?.status == 'NEW' ? "" : order?.shiprocketDetails?.shipments[0]?.etd  ? order?.shiprocketDetails?.shipments[0]?.etd : order?.shiprocketDetails?.shipments[0]?.delivered_date } <br />
                  </td>
                <td className="text-center w-[130px] border">
                  {order.created_at}
                  </td>
                <td className={`text-center w-[] border ${order?.status == "RETURN PENDING" ? 'text-[#d6a907]' :   order.status == "RETURN CANCELLED" ? 'text-[red]' : 'text-[green]'} `}>{order?.shiprocketDetails?.status == 'INVOICED' ? "CANCELED" : order?.shiprocketDetails?.status  || order?.status}</td>
               
         
                <td className="text-center w-[] border">
                 <p className="flex gap-3 w-full items-center justify-center relative">
                  {/* <IoEyeOutline className="text-[#696cff] text-[20px] cursor-pointer" onClick={()=>navigate(`/view-order/${order.shiprocketDetails.id}`)}/> */}
                    <button className={`${ order?.status == "RETURN PENDING" ? "" : "hidden"} px-3 py-1 bg-[#696cff] text-white`} onClick={()=>createShipment(order?.shipment_id , order?.courierCompanyId)}>Return</button>
                    <button className={`${ order?.status == "RETURN CANCELLED" || order?.status !== "RETURN PENDING" ? "hidden" : ""} px-3 py-1 bg-[red] text-white`} onClick={()=>{
                      setCurrentOrder(order)
                      setDeleteBox(true)
                      }}>Cancel</button>
                  {/* <MdOutlineModeEdit className=" text-[20px] cursor-pointer" 
                  onClick={()=>navigate(`/edit-product/${order._id}`)}
                  /> */}
                  
                
                  
                  



                 </p>
                </td>
              </tr>
                ))
              }
            </tbody>

          </table>
          <div className="mt-3 bg-white shadow-md p-3 flex justify-between">
                <p className="flex gap-2 items-center">
                  Orders per page 
                  <select name="" id="" className="p-1 px-4 border border-[#dad3d3] focus:outline-none" value={itemsPerPage} onChange={(e)=>{
                    setItemsPerPage(e.target.value)
                    getOrders(currentPage , e.target.value)
                    }}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  Total Orders : {totalOrders}
                </p>
                <div className="flex gap-4 items-center">
                  <button className={`flex gap-1 items-center ${currentPage > 1 ? "opacity-100" :"opacity-50 cursor-default"} `} onClick={()=>{
                    if(currentPage > 1){
                      setCurrentPage(currentPage - 1)
                      getOrders(currentPage - 1 , itemsPerPage )
                    }
                  }}> <GrFormPreviousLink className="text-[26px]"/> PREV </button>
                  <span className="font-semibold">{currentPage}</span>
                  <button className={`flex gap-1 items-center ${totalOrders  > itemsPerPage*currentPage ? "opacity-100" :"opacity-50 cursor-default"}`} onClick={()=>{
                    if(totalOrders  > itemsPerPage*currentPage){
                      setCurrentPage(currentPage + 1)
                      getOrders(currentPage + 1 , itemsPerPage )
                    }
                  }}>NEXT <GrFormNextLink className="text-[26px]"/>  </button>
                </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>


    {/*  cancel order */}

    <div className={`${deleteBox ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>setDeleteBox(false)}>

</div>
<div className={`${deleteBox ? "fixed" : "hidden" } h-[180px]  max-w-[300px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm overflow-hidden  `}>
    <p className="bg-[#f5f5f9] p-2 text-[red] text-center font-bold fixed w-full  top-0 right-0 ">Cancel Order</p>


      <p className="pt-[50px] text-center px-5"> Are you sure , you want to Cancel Order</p>

      <p className="flex justify-between px-4 pt-6">
        <button className="p-2 px-4 text-white bg-[#776565] rounded-md" onClick={()=>{
          setDeleteBox(false)
          setCurrentOrder(null)
        }}>No</button>
        <button className="p-2 px-4 text-white bg-[#696cff] rounded-md" onClick={()=>{
            if(currentOrder){
                 cancelOrder(currentOrder.id) 
            }
        }}>Sure</button>
      </p>
    
</div>

     {/*  edit Order */}

     <div className={`${editOrder ? "fixed" : "hidden" }  w-[100vw] h-[100vh] z-40 opacity-25 bg-black top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-sm`} onClick={()=>setEditOrder(false)}>

</div>
<div className={`${editOrder ? " right-0" : " right-[-200%]" } fixed h-[100vh]  max-w-[500px] w-full z-50 bg-white top-0 duration-700  rounded-sm overflow-hidden  `}>
  <div className=" bg-[#f5f5f9]">
      <p className="text-[20px] py-2 font-[500] text-center">Order Id : {currentOrder ? currentOrder.channel_order_id : ""}</p>
  {/* <p className=" p-2 text-[red] text-center font-bold    ">Edit Order</p> */}
  </div>


    <div className="flex gap-y-5 flex-wrap pt-8">
        <div className="w-[50%] px-2 ">
        <div className="border rounded-md overflow-hidden p-1 px-2">
          <label htmlFor="weight">Weight (kg)</label>
          <input type="text" name="weight" id="weight" className="w-full border-b  border-black focus:outline-none focus:border-[#696cff] px-2"  value={weight} onChange={(e)=>setWeight(e.target.value)} />
        </div>
        </div>
        <div className="w-[50%] px-2">
        <div className="border rounded-md overflow-hidden p-1 px-2">
          <label htmlFor="height">Height (cm)</label>
          <input type="text" name="height" id="height" className="w-full border-b  border-black focus:outline-none focus:border-[#696cff] px-2" value={height} onChange={(e)=>setHeight(e.target.value)} />
        </div>
        </div>
        <div className="w-[50%] px-2">
        <div className="border rounded-md overflow-hidden p-1 px-2">
          <label htmlFor="breadth">Breadth (cm)</label>
          <input type="text" name="breadth" id="breadth" className="w-full border-b  border-black focus:outline-none focus:border-[#696cff] px-2" value={breadth} onChange={(e)=>setBreadth(e.target.value)} />
        </div>
        </div>
        <div className="w-[50%] px-2">
        <div className="border rounded-md overflow-hidden p-1 px-2">
          <label htmlFor="length">Length (cm)</label>
          <input type="text" name="length" id="length" className="w-full border-b  border-black focus:outline-none focus:border-[#696cff] px-2" value={length} onChange={(e)=>setLength(e.target.value)} />
        </div>
        </div>
    </div>

    <p className="flex justify-center px-4 pt-6">
      
      <button className={`p-2 px-6 text-white bg-[#696cff] rounded-md ${height && weight && length && breadth ? "cursor-pointer opacity-100 " : "cursor-not-allowed opacity-50" } `} onClick={editOrderFunc}>SAVE</button>
    </p>
  
</div>


  </div>
  )
}

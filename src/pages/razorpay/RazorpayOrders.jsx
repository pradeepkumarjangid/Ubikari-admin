import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowRightLong } from "react-icons/fa6";

export default function RazorpayOrders() {
    let navigate = useNavigate()
    const notifyError = (msg) =>  toast.error(msg)
      const notifySuccess = (msg) => toast.success(msg)
      const { showIcons, setShowIcons } = useContext(navOpen);
    const [status, setStatus] = useState(true);
    const [orders, setOrders] = useState(false);
    const [paymentData, setPaymentData] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(false);
    const[deleteBox , setDeleteBox]= useState(false)
    const[filter , setFilter] = useState("All")
    const[overview , setOverview] = useState("Today")
    let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
    UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
    let headers = {
      Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
    };
   
  
    const getPaymentData = async()=>{
      try{
        let result = await apiObj.getPaymentData(headers)
       setPaymentData(result.data.data)
        console.log(result)
      }catch(err){
        console.log(err)
        if(err.message && err.message == "Network Error"){
          
        }
      }
    }
    const getRazorpayPayments = async()=>{
      try{
        let result = await apiObj.getRazorpayPayment(headers)
        if(result.data.combinedData && result.data.combinedData.length > 0 ){
          setOrders(result.data.combinedData)
        }else{
          setOrders('no data')
        }
        // console.log(result)
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
        getRazorpayPayments()
      }
    }
  
    function formatDate(dateString) {
      const date = new Date(dateString * 1000);
      
      const options = {
        weekday: 'short', // Short weekday name
        month: 'short',   // Short month name
        day: 'numeric',   // Numeric day
        hour: 'numeric',  // Hour
        minute: 'numeric', // Minutes
        hour12: true      // Use 12-hour format
      };
      
      // Convert the date to desired format
      return date.toLocaleString('en-US', options);
  }
    useEffect(()=>{
      getRazorpayPayments()
      getPaymentData()
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

        {/* overview and time filter */}
        <div className=" bg-white shadow-md rounded-sm  mb-4">
            <div className="flex gap-2 px-3 pt-4 ">

            <p>Overview</p>
            <select name="" id="" className="bg-transparent text-[#696cff] focus:outline-none" value={overview} onChange={(e)=>setOverview(e.target.value)}>
                <option value="Today" className="text-black">Today</option>
                <option value="Last 7 days" className="text-black">Last 7 days</option>
                <option value="Last 30 days" className="text-black">Last 30 days</option>
                <option value="Last 365 days" className="text-black">Last 365 days</option>
            </select>
            </div>



            <div>
                
                <div className="flex justify-between flex-wrap">
                    <div className={`sm:w-[33%] cursor-pointer w-full p-3  ${
          showIcons ? "lg:w-[33%] w-full" : "md:w-[33%] w-full"
        } `}>
                        <div className="border rounded-md bg-[#f5f5f9] p-4 pb-2 hover:border-[#696cff]">

                        <p className="text-[19px] font-[400] text-[#40566d]">Collected Amount</p>
                        <p className="text-[20px] font-[600]"> <span>₹
                        </span> {paymentData ? (overview == "Today" ? paymentData?.daily?.captured?.amount : overview == "Last 7 days" ? paymentData?.weekly?.captured?.amount : overview == "Last 30 days" ? paymentData?.monthly?.captured?.amount :  paymentData?.yearly?.captured?.amount ) : "--"}</p>
                        <p className="text-[15p] text-[#40566d] "> from {paymentData ? (overview == "Today" ? paymentData?.daily?.captured?.count : overview == "Last 7 days" ? paymentData?.weekly?.captured?.count : overview == "Last 30 days" ? paymentData?.monthly?.captured?.count :  paymentData?.yearly?.captured?.count ) : "--"} captured payments</p>
                        {/* <p className="text-[15px] text-[#40566d] flex pt-4 justify-end"> <span className="border-b cursor-pointer text-[#696cff] border-[#696cff] flex gap-2 items-center">View All <FaArrowRightLong/> </span></p> */}
                        </div>
                    </div>
                    <div className={`sm:w-[33%] w-full p-3 cursor-pointer  ${
          showIcons ? "lg:w-[33%] w-full" : "md:w-[33%] w-full"
        } `} onClick={()=>navigate('/refund-orders')}>
                        <div className="border rounded-md bg-[#f5f5f9] p-4 pb-2 hover:border-[#696cff]">

                        <p className="text-[19px] font-[400] text-[#40566d]">Refund Amount</p>
                        <p className="text-[20px] font-[600]"> <span>₹
                        </span> {paymentData ? (overview == "Today" ? paymentData?.daily?.refunds?.refundedAmount : overview == "Last 7 days" ? paymentData?.weekly?.refunds?.refundedAmount : overview == "Last 30 days" ? paymentData?.monthly?.refunds?.refundedAmount :  paymentData?.yearly?.refunds?.refundedAmount ) : "--"}</p>
                        <p className="text-[15px] text-[#40566d] "> {paymentData ? (overview == "Today" ? paymentData?.daily?.refunds?.refundCount : overview == "Last 7 days" ? paymentData?.weekly?.refunds?.refundCount : overview == "Last 30 days" ? paymentData?.monthly?.refunds?.refundCount :  paymentData?.yearly?.refunds?.refundCount ) : "--"} Processed</p>
                        {/* <p className="text-[15px] text-[#40566d] flex pt-4 justify-end"> <span className="border-b cursor-pointer text-[#696cff] border-[#696cff] flex gap-2 items-center">View All <FaArrowRightLong/> </span></p> */}
                        </div>
                    </div>
                    <div className={`sm:w-[33%] cursor-pointer w-full p-3  ${
          showIcons ? "lg:w-[33%] w-full" : "md:w-[33%] w-full"
        } `}>
                        <div className="border rounded-md bg-[#f5f5f9] p-4 pb-2 hover:border-[#696cff]">

                        <p className="text-[19px] font-[400] text-[#40566d]">Failed</p>
                        <p className="text-[20px] font-[600]">  {paymentData ? (overview == "Today" ? paymentData?.daily?.failed?.amount : overview == "Last 7 days" ? paymentData?.weekly?.failed?.amount : overview == "Last 30 days" ? paymentData?.monthly?.failed?.amount :  paymentData?.yearly?.failed?.amount ) : "--"}</p>
                        <p className="text-[15px] text-[#40566d] "> {paymentData ? (overview == "Today" ? paymentData?.daily?.failed?.count : overview == "Last 7 days" ? paymentData?.weekly?.failed?.count : overview == "Last 30 days" ? paymentData?.monthly?.failed?.count :  paymentData?.yearly?.failed?.count ) : "--"} Payments</p>
                        {/* <p className="text-[15px] text-[#40566d] flex pt-4 justify-end"> <span className="border-b cursor-pointer text-[#696cff] border-[#696cff] flex gap-2 items-center">View All <FaArrowRightLong/> </span></p> */}
                        </div>
                    </div>
                    
                    
                   
                </div>
            </div>
        </div>


        <div className="flex justify-between flex-wrap gap-4 px-2 items-center w-full">

            <div>
                Status :  
                <select name="" id="" className="bg-transparent text-[#696cff] focus:outline-none" value={filter}  onChange={(e)=>setFilter(e.target.value)}>
                <option value="All" className="text-black">All</option>
                <option value="Captured" className="text-black">Captured</option>
                <option value="Failed" className="text-black">Failed</option>
                <option value="Refunded" className="text-black">Refunded</option>
            </select>
            </div>
          <div className="relative ">
            <input
              type="search"
              className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
              placeholder="Search..."
            //   onChange={(e)=>searchOrder(e.target.value)}
            />
          </div>
          
        </div>

        <div className="pt-5 max-w-[100vw] overflow-hidden ">
          <div className="overflow-auto">
          <table className="w-full min-w-[950px]  border">
            <thead>
              <tr className="border p-2 font-semibold text-[16px] text-[#696cff]">
                <th className="border text-left p-2">Payment Id</th>
          
                <th className="border">Bank RRN</th>
                <th className="border">Customer detail</th>
                <th className="border">Created On</th>
                <th className="border">Amount</th>
                <th className="border">Status</th>
                {/* <th className="border">ESTIMATE DELIVERY </th>
                <th className="border p-2">STATUS</th>
                <th className="border">Action</th> */}
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

              <tr className={`border p-2 hover:bg-white text-[14px] cursor-pointer ${filter == "All" ? "" : filter == "Captured" &&  order.status == "captured" ? "" : filter == "Failed" && order.status == "failed" ? "" : filter == "Refunded" && order.status == "refunded" ? ""  :"hidden"} `} key={index} onClick={()=>navigate(`/view-razorpay-payment/${order.id}`)}>
                <td className="text-left  py-2 border px-5">{order.id}</td>
                
                <td className="text-center  border px-3">
                    <p className="text-center">{order.acquirer_data.rrn ? order.acquirer_data.rrn : "--" }</p>
                    <p className="text-center text-[#768ea7] text-[12px]">{ order.method }</p>
                    </td>
                <td className="text-center w-[] border px-3">
                <p className="text-center">{order.contact ? order.contact : "--"}</p>
                <p className="text-center text-[#768ea7] text-[12px] ">{order.email ? order.email : '--'}</p>
                </td>
                <td className="text-center w-[] border px-3">{formatDate(order.created_at)}</td>
                <td className="text-center w-[] border px-3"> ₹ {order.amount/100}</td>
                <td className="text-center w-[] border px-3"> 
                    <p className={` py-1 rounded-[7px] w-[100px] text-center mx-auto ${order.status == "captured" ? "bg-[#00a35217] text-[#008a7c]" : order.status == "failed" ? "bg-[#d92d2017] text-[#db2d47]" : ""} `}>
                    {order.status == "failed" ? "Failed" : order.status == "captured" ? "Captured" : order.status} 
                        </p></td>
                
              </tr>
                ))
              }
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </Layout>



    </div>
  )
}

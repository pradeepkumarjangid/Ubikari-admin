import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";

export default function ViewRazorpayOrder() {
    let navigate = useNavigate()
    const notifyError = (msg) =>  toast.error(msg)
      const notifySuccess = (msg) => toast.success(msg)
      let {id} = useParams()
      const { showIcons, setShowIcons } = useContext(navOpen);
    const [status, setStatus] = useState(true);
    const [order, setOrder] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(false);
    const[deleteBox , setDeleteBox]= useState(false)
    let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
    UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
    let headers = {
      Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
    };
   
  
    const getRazorpayPaymentDetails = async()=>{
      try{
        let result = await apiObj.getSingleRazorpayPayment(id , headers)
        console.log(result.data.data)
       setOrder(result.data.data)
      }catch(err){
        console.log(err)
        if(err.message && err.message == "Network Error"){
          setOrder('Network')
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
        getRazorpayPaymentDetails()
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
            



            <div>
                
                <div className="flex justify-between flex-wrap">
                    <div className={` w-full p-3  `}>
                        <div className=" rounded-md   ">


                                <div className="flex gap-5">

                                <div className={`p-3 rounded-sm h-[55.8px] w-[55.8px] border text-[30px] ${order && order.razorpayPaymentDetails && order.razorpayPaymentDetails.status == "captured" ? "bg-[#e8f6f0] text-[#008659]" : "bg-[#d92d2017] text-[#db2d47]"}`}>
                                    {
                                        order && order.razorpayPaymentDetails && order.razorpayPaymentDetails.status == "captured" ? <IoMdCheckmark/> : 
                                        order && order.razorpayPaymentDetails && order.razorpayPaymentDetails.status == "failed" ? <FaXmark/> : null
                                    }
                                </div>

                                <div className="">
                                <div className="flex gap-3">

                                <p className="text-[20px] font-[600]"> <span>₹
                        </span> { order && order.razorpayPaymentDetails ?  (order.razorpayPaymentDetails.amount)/100  :0}</p>
                        
                        <p className={` py-[2px] rounded-[7px] px-2 text-center  
                            ${order && order.razorpayPaymentDetails && order.razorpayPaymentDetails.status == "captured" ? "bg-[#00a35217] text-[#008a7c]" :
                             order && order.razorpayPaymentDetails && order.razorpayPaymentDetails.status == "failed" ? "bg-[#d92d2017] text-[#db2d47]" : ""} `}>
                    {order && order.razorpayPaymentDetails  && order.razorpayPaymentDetails.status == "failed" ? "Failed" :
                     order && order.razorpayPaymentDetails && order.razorpayPaymentDetails.status == "captured" ? "Captured" :  order?.razorpayPaymentDetails?.status} 
                        </p> 
                                </div>
                                <div className="text-[13px]">
                                    Created On : { order && order.razorpayPaymentDetails && order.razorpayPaymentDetails.created_at ?  formatDate(order.razorpayPaymentDetails.created_at) : ""}
                                </div>
                                </div>
                        
                                </div>
                      
                        </div>
                    </div>
                  
                    
                    
                   
                </div>
            </div>
        </div>


        <div className="flex justify-end flex-wrap gap-4 px-2 items-center w-full">
     
          
        </div>

        <div className="pt-5 max-w-[100vw] overflow-hidden ">
          <div className="overflow-auto">
          <table className="w-full min-w-[950px]  ">
     
            <tbody>
              {
                order == false ?
                <p>Please wait...</p> :
                order == "no data" ?
                <p>No data found</p> :
                order == "Network" ?
                <p>Network Error</p> :
                <div>

                    <div className="rounded-md border overflow-hidden">
                        <div className="px-3 py-1 border-b rounded-t-md bg-[#f8fafc] text-[17px] font-[600]">
                        Details
                        </div>
                        <div className="p-3">
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Payment ID</p>
                                <p className="">{order?.razorpayPaymentDetails?.id}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Bank RRN</p>
                                <p className="">{order?.razorpayPaymentDetails?.acquirer_data.rrn}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Order ID</p>
                                <p className="">{order?.razorpayPaymentDetails?.order_id}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Invoice ID</p>
                                <p className="">{order?.razorpayPaymentDetails?.invoice_id}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Payment method</p>
                                <div>

                                <p className="">{order?.razorpayPaymentDetails?.method} : ({order?.razorpayPaymentDetails?.upi?.vpa})</p>
                                <p className=""> Payer Account Type : {order?.razorpayPaymentDetails?.upi.payer_account_type}</p>
                                </div>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Customer details</p>
                                <div>

                                <p className="">{order?.razorpayPaymentDetails?.contact} </p>
                                <p className=""> {order?.razorpayPaymentDetails?.email}</p>
                                </div>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Total Fee</p>
                                <p className="">{order?.razorpayPaymentDetails?.fee}</p>
                            </div>
                         
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Description</p>
                                <p className="">{order?.razorpayPaymentDetails?.description}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Notes</p>
                                <p className="">{order?.razorpayPaymentDetails?.notes.address}</p>
                            </div>
                        </div>

                    </div>
                    <div className={`rounded-md border overflow-hidden my-5 ${order && order.razorpayRefunds && order.razorpayRefunds[0] ? "" : "hidden"}`}>
                        <div className="px-3 py-1 border-b rounded-t-md bg-[#f8fafc] text-[17px] font-[600]">
                        Refund
                        </div>
                        <div className="p-3">
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Refund ID</p>
                                <p className="">{order?.razorpayRefunds[0]?.id}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">ARN/RRN</p>
                                <p className="">{order?.razorpayRefunds[0]?.acquirer_data.rrn}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Amount</p>
                                <p className="">{order?.razorpayRefunds[0]?.amount}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Currency</p>
                                <p className="">{order?.razorpayRefunds[0]?.currency}</p>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Refund speed</p>
                                <div>

                                <p className=""> {order?.razorpayRefunds[0]?.speed_processed}</p>
                               
                                </div>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Issued on</p>
                                <div>

                                <p className="">{formatDate(order?.razorpayRefunds[0]?.created_at)} </p>
                                </div>
                            </div>
                            <div className="flex border-b flex-wrap p-2">
                                <p className=" w-full sm:w-[30%]">Timeline</p>
                                <p className="">Takes 3-5 working days</p>
                            </div>
                         
                            
                        </div>

                    </div>
                </div>
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

import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminOrderTable from "../NewOrders/NewOrders";
import AdminOrderTableExpandable from "../NewOrders/AdminOrderTableExpend";

export default function Orders() {
    let navigate = useNavigate()
  const notifyError = (msg) =>  toast.error(msg)
    const notifySuccess = (msg) => toast.success(msg)
    const { showIcons, setShowIcons } = useContext(navOpen);
  const [status, setStatus] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(false);
  const[deleteBox , setDeleteBox]= useState(false)
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };
 

  const getOrders = async()=>{
    try{
      let result = await apiObj.getOrders(headers)
      if(result.data.orders && result.data.orders.length > 0 ){
        setOrders(result.data.orders)
      }else{
        setOrders([])
      }
      console.log(result)
    }catch(err){
      console.log(err)
      if(err.message && err.message == "Network Error"){
        setOrders([])
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
          setOrders([])
        }
        console.log(result)
      }catch(err){
        console.log(err)
        if(err.response){
          if(err.response.data.message == "No orders found"){
            setOrders([])
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
  const editOrder = async(order ,status)=>{
   
      let data = {
        status : status
      }
      try{
    
        let result = await apiObj.editOrder( order._id, data , headers)
        console.log(result)
        notifySuccess('Order Updated ')
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
  useEffect(()=>{
    getOrders()
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
          <div className="flex justify-end flex-wrap gap-4 px-2 items-center w-full">
            <div className="relative ">
              <input
                type="search"
                className="p-2 w-[280px] rounded-md border border- focus:shadow-md focus:outline-none foucs:border-[2px]"
                placeholder="Search..."
                onChange={(e)=>searchOrder(e.target.value)}
              />
            </div>
            
          </div>

{/* <AdminOrderTable orders={orders}/> */}
<AdminOrderTableExpandable orders={orders}/>
          <div className="pt-5 max-w-[100vw] overflow-hidden ">
            <div className="overflow-auto">
            <table className="w-full min-w-[950px]  border">
              <thead>
                <tr className="border p-2 font-semibold text-[16px] text-[#696cff]">
                  <th className="border">ID</th>
            
                  <th className="border">CUSTOMER</th>
                  <th className="border">AMOUNT</th>
                  <th className="border">PAYMENT METHOD</th>
                  <th className="border">ORDER DATE</th>
                  <th className="border">ESTIMATE DELIVERY </th>
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

                <tr className="border p-2 hover:bg-white" key={index}>
                  <td className="text-center  border">{order.orderId}</td>
                  
                  <td className="text-center  border">{order.userId.name}</td>
                  <td className="text-center w-[] border">{+(order.amountAfterShipping || 0)?.toFixed(2)}</td>
                  <td className="text-center w-[] border">{order.paymentMethod}</td>
                  <td className="text-center w-[] border">{formatDate(order.createdAt)}</td>
                  <td className="text-center w-[] border"><input type="date" value={"ii"} className="bg-transparent focus:outline-[#696cff]" /></td>
                  <td className="text-center  border p-2">	
                  <select name="" id="" className="bg-transparent focus:outline-[#696cff]" value={order.status} onChange={(e)=>editOrder(order , e.target.value)}>
                      <option value="New Order">New Order</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Ready for Pick">Ready for Pick</option>
                      <option value="Order Dispatched">Order Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select></td>
                  <td className="text-center w-[] border">
                   <p className="flex gap-3 w-full justify-center">
                    <IoEyeOutline className="text-[#696cff] text-[20px] cursor-pointer" onClick={()=>navigate(`/view-order/${order?.orderId}`)}/>
                    {/* <MdOutlineModeEdit className=" text-[20px] cursor-pointer" 
                    onClick={()=>navigate(`/edit-product/${order._id}`)}
                    /> */}
                    <RiDeleteBin6Line className="text-[red] text-[20px] cursor-pointer" onClick={()=>{
                      setCurrentOrder(order)
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
    <p className="bg-[#f5f5f9] p-2 text-[red] text-center font-bold fixed w-full  top-0 right-0 ">Delete Order</p>


      <p className="pt-[50px] text-center px-5"> Are you sure , you want to delete order</p>

      <p className="flex justify-between px-4 pt-6">
        <button className="p-2 px-4 text-white bg-[#776565] rounded-md" onClick={()=>{
          setDeleteBox(false)
          setCurrentOrder(null)
        }}>Cancel</button>
        <button className="p-2 px-4 text-white bg-[#696cff] rounded-md" onClick={deleteOrder}>Delete</button>
      </p>
    
</div>
    </div>
  )
}

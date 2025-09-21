import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


import { MdCurrencyRupee } from "react-icons/md";
import { IoTriangle } from "react-icons/io5";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaBullseye } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import { MdOutlineWifiProtectedSetup } from "react-icons/md";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { FaShareFromSquare } from "react-icons/fa6";
import { LuFilter } from "react-icons/lu";
import { Tooltip } from 'recharts';


// Recharts
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, CartesianGrid} from 'recharts';

const pdata = [
    {
        Month : "Jan",
        Ring : 700,
        Earring : 1789,
        Necklace : 4789,
        Set : 2789
    },
    {
        Month : "Fab",
        Ring : 2000,
        Earring : 4346,
        Necklace : 3343,
        Set : 3425
    },
    {
        Month : "March",
        Ring : 990,
        Earring : 4235,
        Necklace : 4252,
        Set : 4321
    },
    {
        Month : "April",
        Ring : 2990,
        Earring : 3456,
        Necklace : 4243,
        Set : 3400
    },
    {
        Month : "May",
        Ring : 2450,
        Earring : 2000,
        Necklace : 3420,
        Set : 4500
    },
    {
        Month : "June",
        Ring : 1330,
        Earring : 2560,
        Necklace : 2340,
        Set : 2300
    },
    {
        Month : "July",
        Ring : 3400,
        Earring : 3800,
        Necklace : 3400,
        Set : 4100
    },
    {
        Month : "Aug",
        Ring : 2300,
        Earring : 5000,
        Necklace : 4000,
        Set : 3300
    },
    {
        Month : "Sep",
        Ring : 1700,
        Earring : 2000,
        Necklace : 3400,
        Set : 2300
    },
    {
        Month : "Oct",
        Ring : 1400,
        Earring : 1800,
        Necklace : 2200,
        Set : 1200
    },
    {
        Month : "Nov",
        Ring : 3300,
        Earring : 2800,
        Necklace : 2300,
        Set : 870
    },
    {
        Month : "Dec",
        Ring : 2000,
        Earring : 3300,
        Necklace : 2500,
        Set : 342
    },
]


export default function Dashboard() {
    let navigate = useNavigate()
    const notifyError = (msg) =>  toast.error(msg)
      const notifySuccess = (msg) => toast.success(msg)
      const { showIcons, setShowIcons } = useContext(navOpen);
      let [data , setData]= useState(false)
      let [graphData , setGraphData]= useState(false)
      let [customers , setCustomers]= useState(false)
      let [orders , setOrders]= useState(false)
      let [target , setTarget] = useState("TODAY")
    let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
    UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
    let headers = {
      Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
    };
    

    const getData = async()=>{
      if(UNIKARIADMIN){

        try{
            let result = await apiObj.getDashboardData(headers)
            console.log(result)
            setData(result.data.data)
            if(result.data.todayUsers && result.data.todayUsers.length > 0  ){
              setCustomers(result.data.todayUsers)
            }else{
                setCustomers('no data')
            }
            if(result.data.todayOrders && result.data.todayOrders.length > 0  ){
              setOrders(result.data.todayOrders)
            }else{
              setOrders('no data')
            }
        }catch(err){
          console.log(err)
          if(err.response && err.response.data.error == " Request is not authorized"){
            notifyError('Please Login Again')
            localStorage.removeItem('UNIKARIADMIN')
            navigate('/')
          }
        }
      }else{
        navigate("/")
      }
    }
    const getDashboardGraph = async()=>{
      if(UNIKARIADMIN){

        try{
            let result = await apiObj.getDashboardGraph(headers)
            console.log(result)
            setGraphData(result.data.data)
        }catch(err){
          console.log(err)
          if(err.response && err.response.data.error == " Request is not authorized"){
            notifyError('Please Login Again')
            localStorage.removeItem('UNIKARIADMIN')
            navigate('/')
          }
        }
      }else{
        setGraphData(pdata)
        navigate("/")
      }
    }
  
  
    useEffect(()=>{
      getData()
      getDashboardGraph()
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
           duration-700 overflow-auto `}
        >


          <div className=" px-2 items-center w-full ">

            <div className="flex justify-end pr-4">

            <div className="flex gap-2 items-center">
              <select name="" id="" value={target} onChange={(e)=>setTarget(e.target.value)} className="p-1 px-3 focus:outline-[#696cff] border-[#696cff] border rounded-sm">
                <option value="TODAY">TODAY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
              </select>
              <LuFilter className="text-[30px] text-[#696cff]"/>
            </div>
            </div>

            <div className="flex justify-between flex-wrap">
              <div className={`${showIcons ? "md:w-[50%] lg:w-[33%] sm:w-[50%] w-full " : 'sm:w-[50%] md:w-[33%] w-full'}   p-3`}>

              <div className={`  bg-white shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px] rounded-[7px] overflow-hidden hover:shadow-2xl`}>
                <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">{target} ORDERS</p>
                <p className=" p-3 pl-6  text-[26px] font-semibold ">{data && target == "TODAY" ? data.daily.orders : data && target == "WEEKLY" ? data.weekly.orders : data && target == "MONTHLY" ? data.monthly.orders : data && target == "YEARLY" ? data.yearly.orders : 0}</p>
                <p className="mb-2 ml-3 w-[110px] border-b cursor-pointer" onClick={()=>navigate('/shiprocket-orders')}>View all orders</p>

              </div>
              </div>
              <div className={`${showIcons ? "md:w-[50%] lg:w-[33%] sm:w-[50%] w-full " : 'sm:w-[50%] md:w-[33%] w-full'}   p-3`}>

              <div className={`  bg-white shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px] rounded-[7px] overflow-hidden hover:shadow-2xl`}>
                <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">{target} EARNINGS</p>
                <p className=" p-3 pl-6  text-[26px] font-semibold flex gap-2 ">₹ {data && target == "TODAY" ? (data.daily.totalPrice + data.daily.canceledTotalPrice).toFixed(2) : data && target == "WEEKLY" ? (data.weekly.totalPrice + data.weekly.canceledTotalPrice).toFixed(2) : data && target == "MONTHLY" ? (data.monthly.totalPrice + data.monthly.canceledTotalPrice).toFixed(2) : data && target == "YEARLY" ? (data.yearly.totalPrice + data.yearly.canceledTotalPrice).toFixed(2) : 0}</p>
                <p className="mb-2 ml-3 w-[110px] py-3 cursor-pointer"></p>

              </div>
              </div>
              <div className={`${showIcons ? "md:w-[50%] lg:w-[33%] sm:w-[50%] w-full " : 'sm:w-[50%] md:w-[33%] w-full'}   p-3`}>

              <div className={`  bg-white shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px] rounded-[7px] overflow-hidden hover:shadow-2xl`}>
                <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">{target} CUSTOMERS</p>
                <p className=" p-3 pl-6  text-[26px] font-semibold ">{data && target == "TODAY" ? data.daily.users : data && target == "WEEKLY" ? data.weekly.users : data && target == "MONTHLY" ? data.monthly.users : data && target == "YEARLY" ? data.yearly.users : 0}</p>
                <p className="mb-2 ml-3 w-[140px] border-b cursor-pointer" onClick={()=>navigate('/customers')}>View all customers</p>

              </div>
              </div>
              <div className={`${showIcons ? "md:w-[50%] lg:w-[33%] sm:w-[50%] w-full " : 'sm:w-[50%] md:w-[33%] w-full'}   p-3`}>

              <div className={`  bg-white shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px] rounded-[7px] overflow-hidden hover:shadow-2xl`}>
                <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">TOTAL ORDERS</p>
                <p className=" p-3 pl-6  text-[26px] font-semibold ">{data  ? data.sales.totalSaleCount : 0}</p>
                <p className="mb-2 ml-3 w-[110px] border-b cursor-pointer" onClick={()=>navigate('/shiprocket-orders')}>View all orders</p>

              </div>
              </div>
              <div className={`${showIcons ? "md:w-[50%] lg:w-[33%] sm:w-[50%] w-full " : 'sm:w-[50%] md:w-[33%] w-full'}   p-3`}>

              <div className={`  bg-white shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px] rounded-[7px] overflow-hidden hover:shadow-2xl`}>
                <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">TOTAL EARNINGS</p>
                <p className=" p-3 pl-6  text-[26px] font-semibold flex gap-2">₹ {data  ? data.sales.totalSales.toFixed(2) : 0}</p>
                <p className="mb-2 ml-3 w-[110px] py-3 cursor-pointer"></p>

              </div>
              </div>
              <div className={`${showIcons ? "md:w-[50%] lg:w-[33%] sm:w-[50%] w-full " : 'sm:w-[50%] md:w-[33%] w-full'}   p-3`}>

              <div className={`  bg-white shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px] rounded-[7px] overflow-hidden hover:shadow-2xl`}>
                <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">TOTAL CUSTOMERS</p>
                <p className=" p-3 pl-6  text-[26px] font-semibold ">{data  ? data.sales.totalUsers : 0}</p>
                <p className="mb-2 ml-3 w-[140px] border-b cursor-pointer" onClick={()=>navigate('/customers')}>View all customers</p>

              </div>
              </div>

              <div className={`${showIcons ? "md:w-[50%] lg:w-[33%] sm:w-[50%] w-full " : 'sm:w-[50%] md:w-[33%] w-full'}   p-3`}>

              <div className={`  bg-white shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px] rounded-[7px] overflow-hidden hover:shadow-2xl`}>
                <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">{target} CANCELED ORDERS</p>
                <p className=" p-3 pl-6  text-[26px] font-semibold "> ₹ {data && target == "TODAY" ? data.daily.canceledTotalPrice : data && target == "WEEKLY" ? data.weekly.canceledTotalPrice : data && target == "MONTHLY" ? data.monthly.canceledTotalPrice : data && target == "YEARLY" ? data.yearly.canceledTotalPrice : 0}</p>
                <p className="  pl-6  text-[16px] font-semibold ">  {data && target == "TODAY" ? data.daily.canceledOrders : data && target == "WEEKLY" ? data.weekly.canceledOrders : data && target == "MONTHLY" ? data.monthly.canceledOrders : data && target == "YEARLY" ? data.yearly.canceledOrders : "--"} Orders</p>
                <p className="mb-2 ml-3 w-[110px] border-b cursor-pointer" onClick={()=>navigate('/shiprocket-orders')}>View all orders</p>

              </div>
              </div>

             
            
              
            </div>



  {/* Charts */}
  <div className='w-[885px] h-[400px] bg-[white] py-6 px-8 mt-7'>
                <div className='flex items-center justify-between '>
                    <p className='sofia-sans   text-[18px] font-[400] pl-20'>Total Sale</p>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-1'>
                            <div className='w-[14px] h-[14px] bg-[#ED5782]'></div>
                            <p className='sofia-sans   text-[18px] font-[400] pt-[2px]'>Rings</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-[14px] h-[14px] bg-[#E5DF88]'></div>
                            <p className='sofia-sans   text-[18px] font-[400] pt-[2px]'>Earring</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-[14px] h-[14px] bg-[#7258DB]'></div>
                            <p className='sofia-sans   text-[18px] font-[400] pt-[2px]'>Necklace</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-[14px] h-[14px] bg-[#A6A6A4]'></div>
                            <p className='sofia-sans   text-[18px] font-[400] pt-[2px]'>Set</p>
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="100%" backgroundColor="#cfbae7">
                    <LineChart data={graphData}>
                        <CartesianGrid/>
                        <Line dataKey="Ring" stroke='#ED5782' />
                        <Line dataKey="Earrings" stroke='#E5DF88'/>
                        <Line dataKey="Necklaces" stroke='#7258DB'/>
                        <Line dataKey="Set" stroke='#A6A6A4'/>
                        <XAxis dataKey="month" interval={'preserveStartEnd'}/>
                        <YAxis/>
                        <Tooltip />

                    </LineChart>

                </ResponsiveContainer>

            </div>


              {/* today Orders & customers */}
            <div className="pt-10 flex flex-wrap justify-between">
              
              <div className={` ${showIcons ? "  xl:w-[50%] w-full" : "lg:w-[50%] w-full"} p-5  `}>
                <div className="border border-[#696cff]">

              <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">TODAY ORDERS</p>

              <div>
              <table className="w-full border text-center border-[#696cff]">

                {
                  orders == false ? 
                  <p>Pleadse Wait...</p> :
                  orders == "no data" ? 
                  <p>No data found</p> :
                  orders.map((item , index)=>(
                    <tr className="border cursor-pointer border-[#696cff] hover:bg-white">
                    <td className="border-b border-[#696cff] py-[9px]">
                    {item.channel_order_id}
                    </td>
                    <td className=" text-center">
                    Pradeep Kumar
                    </td >
                    <td className=" text-center">
                    {item.total}
                    </td>
                    <td className=" text-center">
                      {item.createdAt.slice(0,10)}
                    </td>
                  </tr>
                  ))
                }
                
                {/* <tr className="border cursor-pointer border-[#696cff] hover:bg-white">
                  <td className="border-b border-[#696cff] py-[9px]">
                  ORD-36
                  </td>
                  <td className=" text-center">
                  Pradeep Kumar
                  </td >
                  <td className=" text-center">
                  1100
                  </td>
                  <td className=" text-center">
                    New Order
                  </td>
                </tr> */}
               
                </table>
                </div>
                </div>
              </div>
              <div className={` ${showIcons ? "  xl:w-[50%] w-full" : "lg:w-[50%] w-full"} p-5  `}>
                <div className="border border-[#696cff] ">

              <p className="bg-[#696cff] text-[20px] py-1 font-[500] text-[white] text-center">TODAY CUSTOMERS</p>

             <div>
              <table className="w-full border text-center">
              {
                  customers == false ? 
                  <p>Pleadse Wait...</p> :
                  customers == "no data" ? 
                  <p>No data found</p> :
                  customers.map((item , index)=>(
                    <tr className="border cursor-pointer border-[#696cff] hover:bg-white">
                  <td className="border-b border-[#696cff] px-2">
                    {index + 1}.
                  </td>
                  <td className=" text-center">
                    <div>
                      <p className="text-[14px] font-semibold">{item.name}</p>
                      <p className="text-[13px] ">{item.email}</p>
                    </div>
                  </td >
                  <td className=" text-center">
                    {item.contact}
                  </td>
                  <td className=" text-center">
                    {item.status}
                  </td>
                </tr>
                  ))
              }
                
                {/* <tr className="border cursor-pointer border-[#696cff] hover:bg-white">
                  <td className="border-b border-[#696cff] px-2">
                    1.
                  </td>
                  <td className=" text-center">
                    <div>
                      <p className="text-[14px] font-semibold">Pradeep Kumar</p>
                      <p className="text-[13px] ">pkjangid0025@gmail.com</p>
                    </div>
                  </td >
                  <td className=" text-center">
                    8690929814
                  </td>
                  <td className=" text-center">
                    Active
                  </td>
                </tr> */}
               
                
              </table>
             </div>
                </div>
              </div>
            </div>
            
          {/* <div className='flex gap-12 justify-center'>
                <div className="w-[40%]">
                    <div className='min-w-[302px] w-[80%] h-[150px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                        <div className='w-full h-[40px] bg-[#7F37FF] pl-4'>
                            <p className='text-[24px] font-[400] text-[white] '>Sale</p>
                        </div>

                        <div className='flex items-center pt-5'>
                            <span className='text-[40px]'><MdCurrencyRupee /></span>
                            <p className='text-[40px] font-[400]'>15000.00</p>
                            <span className='text-[26px] pl-5 text-[#FFD700]'><IoTriangle /></span>
                        </div>
                    </div>

                    <div className='min-w-[302px] w-[80%] h-[272px] bg-[] rounded-[7px] mt-8 overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                        <div className='w-full h-[40px] bg-[#7F37FF] pl-4'>
                            <p className='text-[24px] font-[400] text-[white] '>Total Earning</p>
                        </div>

                        <div className='flex items-center pt-4 '>
                            <span className='text-[40px]'><MdCurrencyRupee /></span>
                            <p className='text-[40px] font-[400]'>15000.00</p>
                            <span className='text-[26px] pl-5 text-[#56CA00]'><IoTriangle /></span>
                        </div>

                        <p className='sofia-sans  text-[12px] font-[400] text-[#807B7B] pl-12'>Compared to last month</p>

                        <div className='pt-3 pl-12'>
                            <p className='sofia-sans  text-[15px] font-[400] text-[#807B7B]'>Avg Item Sale</p>
                            <span className='text-[20px] font-[700]'>200</span>
                        </div>

                        <div className='pt-2 pl-12'>
                            <p className='sofia-sans  text-[15px] font-[400] text-[#807B7B]'>Top Selling Products</p>
                            <dir>
                                <span className='text-[20px] font-[700]'>200</span>
                                <span className='sofia-sans  text-[20px] font-[700] pl-24'>Ring</span>

                            </dir>
                        </div>
                    </div>
                </div>

                <div className="w-[60%]">
                    <div className='flex  items-center gap-16'>
                        <div className='w-[236px] h-[150px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4'>
                                <p className='text-[24px] font-[400] text-[white] '>Visitor</p>
                            </div>

                            <div className='flex items-center pt-5 justify-center'>
                                <span className='text-[26px] text-[#000000]'><FaBullseye /></span>
                                <p className='text-[40px] font-[400] pl-3'>3.5 K</p>
                                <span className='text-[26px] pl-5 text-[#FFD700]'><IoTriangle /></span>
                            </div>
                        </div>

                        <div className='w-[236px] h-[150px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4'>
                                <p className='text-[24px] font-[400] text-[white]'>Date</p>
                            </div>

                            <div className='flex items-center pt-5 justify-center'>
                                <span className='text-[30px] text-[#000000]'><MdDateRange /></span>
                                <p className='text-[40px] font-[400] pl-3'>12 Nov</p>
                            </div>
                        </div>


                    </div>

                    <div className='flex items-center gap-3 mt-8'>
                        <div className='w-[170px] h-[120px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4 flex items-center '>
                                <p className='text-[18px] font-[400] text-[white] '>Total Order</p>
                            </div>

                            <div className='flex items-center  pl-4 pt-3'>
                                <span className='text-[26px] text-[#000000]'><GrCompliance /></span>
                                <p className='text-[32px] font-[400] pl-2'>1.5 K</p>
                                <span className='text-[26px] pl-2 text-[#FFD700]'><IoTriangle /></span>
                            </div>
                        </div>

                        <div className='w-[170px] h-[120px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4 flex items-center'>
                                <p className='text-[18px] font-[400] text-[white] '>Order Competed</p>
                            </div>

                            <div className='flex items-center pl-4 pt-3'>
                                <span className='text-[26px] text-[#000000]'><GrCompliance /></span>
                                <p className='text-[32px] font-[400] pl-3'>45</p>
                            </div>
                        </div>

                        <div className='w-[170px] h-[120px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4 flex items-center '>
                                <h1 className='text-[18px] font-[400] text-[white] '>Order Process</h1>
                            </div>

                            <div className='flex items-center  pl-4 pt-3'>
                                <span className='text-[30px] text-[#000000]'><MdOutlineWifiProtectedSetup /></span>
                                <p className='text-[32px] font-[400] pl-3'>45</p>
                            </div>

                        </div>

                    </div>

                    <div className='flex items-center gap-3 mt-8'>
                        <div className='w-[170px] h-[120px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4 flex items-center'>
                                <p className='text-[18px] font-[400] text-[white] '>Order Cancel</p>
                            </div>

                            <div className='flex items-center  pl-4 pt-3'>
                                <span className='text-[30px] text-[#000000]'><MdOutlineFreeCancellation /></span>
                                <p className='text-[32px] font-[400] pl-3'>45</p>
                            </div>
                        </div>

                        <div className='w-[170px] h-[120px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4 flex items-center'>
                                <p className='text-[18px] font-[400] text-[white] '>Order Delivered</p>
                            </div>

                            <div className='flex items-center pl-4 pt-3'>
                                <span className='text-[30px] text-[#000000]'><MdCheckBox /></span>
                                <p className='text-[32px] font-[400] pl-3'>200</p>
                            </div>
                        </div>

                        <div className='w-[170px] h-[120px] bg-[] rounded-[7px] overflow-hidden shadow-[rgba(50,50,93,0.25)_0px_5px_5px_0px]'>
                            <div className='w-full h-[40px] bg-[#7F37FF] pl-4 flex items-center'>
                                <p className='text-[18px] font-[400] text-[white] '>Refund</p>
                            </div>

                            <div className='flex items-center pl-4 pt-3'>
                                <span className='text-[26px] text-[#000000]'><FaShareFromSquare /></span>
                                <p className='text-[32px] font-[400] pl-3'>60</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}


          



            {/* table data  */}
            {/* <div className='w-[885px] mt-6'>
                <div class="relative overflow-x-auto ">
                    <table class="w-full text-left">
                        <thead class="sofia-sans  h-[60px] text-[15px] bg-gray-50 ">
                            <tr className='font-[200]'>
                                <th scope="" class="px-6 py-3">
                                    S.No.
                                </th>
                                <th scope="" class="px-6 py-3">
                                    User Name
                                </th>
                                <th scope="" class="px-6 py-3">
                                    Order
                                </th>
                                <th scope="" class="px-6 py-3">
                                    Date
                                </th>
                                <th scope="" class="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="" class="px-6 py-3">
                                    Payment
                                </th>
                                <th scope="" class="px-6 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className='sofia-sans  text-[15px]'>
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 ">
                                    001
                                </th>
                                <td class="px-6 py-4">
                                    Ranchi
                                </td>
                                <td class="px-6 py-4">
                                    AD Ring-1135
                                </td>
                                <td class="px-6 py-4">
                                    7-11-2024
                                </td>
                                <td class="px-6 py-4">
                                    635.00
                                </td>
                                <td class="px-6 py-4">
                                    COD
                                </td>
                                <td class="px-6 py-4">
                                    Process
                                </td>
                            </tr>
                        </tbody>

                        <tbody className='text-[15px]'>
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    001
                                </th>
                                <td class="px-6 py-4">
                                    Ranchi
                                </td>
                                <td class="px-6 py-4">
                                    AD Ring-1135
                                </td>
                                <td class="px-6 py-4">
                                    7-11-2024
                                </td>
                                <td class="px-6 py-4">
                                    635.00
                                </td>
                                <td class="px-6 py-4">
                                    Online
                                </td>
                                <td class="px-6 py-4">
                                    Deliver
                                </td>
                            </tr>
                        </tbody>

                        <tbody className='text-[15px]'>
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    001
                                </th>
                                <td class="px-6 py-4">
                                    Ranchi
                                </td>
                                <td class="px-6 py-4">
                                    AD Ring-1135
                                </td>
                                <td class="px-6 py-4">
                                    7-11-2024
                                </td>
                                <td class="px-6 py-4">
                                    635.00
                                </td>
                                <td class="px-6 py-4">
                                    COD
                                </td>
                                <td class="px-6 py-4">
                                    Deliver
                                </td>
                            </tr>
                        </tbody>

                        <tbody className='text-[15px]'>
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    001
                                </th>
                                <td class="px-6 py-4">
                                    Ranchi
                                </td>
                                <td class="px-6 py-4">
                                    AD Ring-1135
                                </td>
                                <td class="px-6 py-4">
                                    7-11-2024
                                </td>
                                <td class="px-6 py-4">
                                    635.00
                                </td>
                                <td class="px-6 py-4">
                                    Online
                                </td>
                                <td class="px-6 py-4">
                                    Deliver
                                </td>
                            </tr>
                        </tbody>

                        <tbody className='text-[15px]'>
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    001
                                </th>
                                <td class="px-6 py-4">
                                    Ranchi
                                </td>
                                <td class="px-6 py-4">
                                    AD Ring-1135
                                </td>
                                <td class="px-6 py-4">
                                    7-11-2024
                                </td>
                                <td class="px-6 py-4">
                                    635.00
                                </td>
                                <td class="px-6 py-4">
                                    Online
                                </td>
                                <td class="px-6 py-4">
                                    Process
                                </td>
                            </tr>
                        </tbody>

                        <tbody className='text-[15px]'>
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    001
                                </th>
                                <td class="px-6 py-4">
                                    Ranchi
                                </td>
                                <td class="px-6 py-4">
                                    AD Ring-1135
                                </td>
                                <td class="px-6 py-4">
                                    7-11-2024
                                </td>
                                <td class="px-6 py-4">
                                    635.00
                                </td>
                                <td class="px-6 py-4">
                                    COD
                                </td>
                                <td class="px-6 py-4">
                                    Process
                                </td>
                            </tr>
                        </tbody>

                        <tbody className='text-[15px]'>
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    001
                                </th>
                                <td class="px-6 py-4">
                                    Ranchi
                                </td>
                                <td class="px-6 py-4">
                                    AD Ring-1135
                                </td>
                                <td class="px-6 py-4">
                                    7-11-2024
                                </td>
                                <td class="px-6 py-4">
                                    635.00
                                </td>
                                <td class="px-6 py-4">
                                    COD
                                </td>
                                <td class="px-6 py-4">
                                    Deliver
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='w-full min-h-[50px] flex items-center justify-between px-2 sm:px-5 gap-2 flex-wrap py-2'>
                    <div className='flex items-center gap-2'>
                        <p>Show</p>
                        <select className='w-[55px] h-[25px] sm:h-[30px] border-[1px] border-[black] outline-none rounded-md px-2' name="" id="">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>

                    <div className='min-w-[184] flex items-center gap-2'>
                        <span className=' border-[1px] border-black px-2 text-[20px]'><FaLongArrowAltLeft /></span>
                        <span className=' border-[1px] border-black px-2 text-[20px]' ><FaLongArrowAltRight /></span>
                        <p className='font-[600]'>Page <span>1</span> to <span>10</span></p>
                    </div>
                </div>
            </div> */}
            
          </div>

          
        </div>
      </Layout>


       
    </div>
  )
}

import React, { useContext } from 'react'
// import unikarilogo from "/img/unikari logo.svg"
import unikarilogo from "/img/unikari logo White.svg"
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FaBorderAll } from "react-icons/fa6";
import { navOpen } from '../App';
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";

export default function Sidebar() {
    let navigate = useNavigate()
    const { showIcons, setShowIcons , nav , setNav} = useContext(navOpen)
    
  return (
    <>
    <div className={` ${showIcons ? 'w-[250px]' : ' w-[250px] md:w-[60px]'} sticky top-0  duration-700   h-[100vh] bg-[#696cff]`}>


        <div className={`absolute ${showIcons ? '-rotate-180' : ""} duration-300 top-4 z-30 cursor-pointer -right-4 bg-[#f5f5f9] rounded-[50%] text-white p-1`} onClick={()=>setShowIcons(!showIcons)}>

        <p className={`  bg-[#696cff] rounded-[50%] text-white p-1 `}><FaAngleRight/></p>
        </div>

        <div className={` ${showIcons ? 'w-[250px]' : 'md:w-[60px]'}  duration-700 relative  overflow-hidden bg-[#696cff]`}>

        <div className=' pt-5'>
            <img src={unikarilogo} alt="logo" className='w-[150px] mx-auto cursor-pointer ' onClick={()=>navigate('/')} />
        </div>

        <div className={` ${showIcons ? 'px-4' : 'md:px-0 px-4'} text-white p-2 duration-700 mt-4 h-[calc(100vh-70px)] sidebar overflow-auto font-semibold text-[18px]`}>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Dashboard" ? "bg-white text-[#696cff] font-bold " : ""} `} 
            onClick={()=>{
                navigate('/dashboard')
            }}
            >
                <MdDashboard className='text-[24px]'/> 
                Dashboard
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg  hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Customers" ? "bg-white text-[#696cff] font-bold " : ""} `}
             onClick={()=>{
                navigate('/customers')
            }}>
                <FaUsers className='text-[24px]'/> 
                Customers
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg  hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Categories" ? "bg-white text-[#696cff] font-bold " : ""} `}
             onClick={()=>{
                navigate('/category')
            }}>
                <MdCategory className='text-[24px]'/> 
                Categories
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg  hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Sub Categories" ? "bg-white text-[#696cff] font-bold " : ""} `}
             onClick={()=>{
                navigate('/sub-categories')
            }}>
                <MdOutlineCategory className='text-[24px]'/> 
                Sub Categories
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg  hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Products" || nav == "Edit Product" || nav == "Add Product" ? "bg-white text-[#696cff] font-bold " : ""} `}  onClick={()=>{
                navigate('/products')
            }}>
                <AiFillProduct className='text-[24px]'/> 
                Products
            </p>
            {/* <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Orders" || nav == "View Order" ? "bg-white text-[#696cff] font-bold " : ""} `} onClick={()=>navigate('/orders')}>
                <FaBorderAll className='text-[24px]'/> 
                Orders
            </p> */}
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Shiprocket Orders" || nav == "View shiprocket Order" ? "bg-white text-[#696cff] font-bold " : ""} `} onClick={()=>navigate('/shiprocket-orders')}>
                <FaBorderAll className='text-[24px]'/> 
                Shiprocket Orders
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "refund-orders" || nav == "Return Orders" ? "bg-white text-[#696cff] font-bold " : ""} `} onClick={()=>navigate('/returned-orders')}>
                <FaBorderAll className='text-[24px]'/> 
                Returned Orders
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Razorpay Orders"  ? "bg-white text-[#696cff] font-bold " : ""} `} onClick={()=>navigate('/razorpay')}>
                <FaBorderAll className='text-[24px]'/> 
                Razorpay
            </p> 
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Refund Orders"  ? "bg-white text-[#696cff] font-bold " : ""} `} onClick={()=>navigate('/refund-orders')}>
                <FaBorderAll className='text-[24px]'/> 
                Refund Orders
            </p> 
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Offers"  ? "bg-white text-[#696cff] font-bold " : ""} `} onClick={()=>navigate('/offers')}>
                <FaBorderAll className='text-[24px]'/> 
                Offers
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px] ${nav == "Discount"  ? "bg-white text-[#696cff] font-bold " : ""} `} onClick={()=>navigate('/discount')}>
                <FaBorderAll className='text-[24px]'/> 
                Discount
            </p>
            <p className={`hover:text-[#696cff] hover:bg-[#f5f5f9] mt-1 py-1 rounded-lg  hover:font-bold items-center  cursor-pointer flex gap-4 pl-5 min-w-[218px]  `} onClick={()=>{
                localStorage.removeItem('UNIKARIADMIN')
                navigate('/')
            }}>
                <MdLogout className='text-[24px]'/> 
                Log Out
            </p>
        </div>
        </div>
    </div>
    </>
  )
}

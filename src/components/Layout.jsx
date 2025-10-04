import React, { useContext, useEffect } from 'react'
import Sidebar from './Sidebar'
import { PiUserCircleDashedFill } from "react-icons/pi";
import { navOpen } from '../App';
import { MdMenu } from "react-icons/md";
export default function Layout({children}) {
    const { showIcons, setShowIcons , nav , setNav } = useContext(navOpen)

    const currentUrl = window.location.href
    console.log(currentUrl)
    useEffect(()=>{
        if(currentUrl.includes('dashboard')){
            setNav('Dashboard')
        }else if(currentUrl.includes('home-banners')){
            setNav('Banners')
        }else if(currentUrl.includes('sub-categories')){
            setNav('Sub Categories')
        }else if(currentUrl.includes('category')){
            setNav('Categories')
        }else if(currentUrl.includes('customers')){
            setNav('Customers')
        }else if(currentUrl.includes('add-product')){
            setNav('Add Product')
        }else if(currentUrl.includes('edit-product')){
            setNav('Edit Product')
        }else if(currentUrl.includes('products')){
            setNav('Products')
        }else if(currentUrl.includes('shiprocket')){
            setNav('Shiprocket Orders')
        }else if(currentUrl.includes('returned-orders')){
            setNav('Return Orders')
        }else if(currentUrl.includes('razorpay')){
            setNav('Razorpay Orders')
        }else if(currentUrl.includes('refund-orders')){
            setNav('Refund Orders')
        }else if(currentUrl.includes('orders')){
            setNav('Orders')
        }else if(currentUrl.includes('view-order')){
            setNav('View Order')
        }else if(currentUrl.includes('offers')){
            setNav('Offers')
        }else if(currentUrl.includes('discount')){
            setNav('Discount')
        }
    })
  return (
    <div>
        <div className='flex gap-5 bg-[#f5f5f9] w-full'>
        <div className={`fixed z-40 top-0 left-0 ${showIcons ? "fixed md:hidden" : "hidden"} duration-700 h-[100vh] w-[100vw] bg-black opacity-30`} onClick={()=>setShowIcons(false)}/>
            <div className={`fixed z-40 top-0 left-0 ${showIcons ? "left-0" : "md:left-0 left-[-150%]"} duration-700 `}>

                <Sidebar/>
            </div>
            <div>
                
            <div className={`fixed z-30 top-0 ${showIcons ? ' w-full md:w-[calc(100vw-270px)] md:left-[270px]' : "md:w-[calc(100vw-80px)] w-full md:left-[80px]"} duration-700  h-[70px] bg-white shadow-md`}>
                <div className='h-[70px] flex w-full justify-between items-center px-3'>
                    <MdMenu className={`text-[24px] text-[#696cff] md:hidden cursor-pointer`}  onClick={()=>setShowIcons(true)}/>
                    <p className='text-[20px] font-semibold'>{nav}</p>
                    <p className=' text-[20px] font-semibold  items-center gap-2'><PiUserCircleDashedFill className='mx-auto text-[24px]'/> Admin</p>
                </div>
            </div>
            <div className={`pt-24 ${showIcons ? 'md:w-[calc(100vw-270px)] md:pl-[270px] w-full' : "md:w-[calc(100vw-80px)] md:pl-[80px] w-full "} duration-700 min-h-[100vh]`}>

            {children}
            </div>
            </div>
        </div>
    </div>
  )
}

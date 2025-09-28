import React, { useContext, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import { navOpen } from '../../App';
import logo from '/img/unikari logo.svg';
import { useNavigate, useParams } from 'react-router-dom';
import apiObj from '../../services/api';
import { useReactToPrint } from 'react-to-print';

export default function ViewOrder() {
    let navigate = useNavigate();
    const { showIcons } = useContext(navOpen);
    const { id } = useParams();
    const [order, setOrder] = useState(false);
    
    // Getting token from localStorage
    let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
    UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
    let headers = {
        Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
    };
    
    // Function to fetch order details
    const getOrderDetail = async () => {
        try {
            let result = await apiObj.getSingleOrder(id, headers);
            console.log(result);
            if (result.data.order) {
                setOrder(result.data.order);
            }
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data.error === "Request is not authorized") {
                localStorage.removeItem("UNIKARIADMIN");
                navigate('/');
            }
        }
    };
    
    // Formatting date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options).replace(',', '');
    }
    

        const contentRef = useRef();
      
        // Function to handle the print action
        const handlePrint = useReactToPrint({
          content: () => {
            console.log("contentRef content:", contentRef.current); // Add this to confirm content
            return contentRef.current;
          },
          onBeforePrint: () => console.log("Before print, contentRef content:", contentRef.current),
          onAfterPrint: () => console.log("Print complete"),
          documentTitle: 'Order Summary',
        //   onBeforeGetContent: () => console.log("Preparing content for print..."),
        });
    
    useEffect(() => {
        getOrderDetail();
    }, []);
    
    useEffect(() => {
        if (!localStorage.getItem('UNIKARIADMIN')) {
            navigate('/');
        }
    });


    
    return (
    
            <div 
            // className={`${
            //     showIcons ? "md:w-[calc(100vw-292px)] w-[calc(100vw-17px)]" : "md:w-[calc(100vw-102px)] w-[calc(100vw-17px)]"
            // } duration-700`} 
            className={`
                max-w-[700px] mx-auto duration-700 border`} 
            ref={contentRef}>

                {/* Printable Section */}
                <div className="bg-white p-4 rounded-md" >
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <img src={logo} alt="Logo" className="w-[100px]" />
                        <div className="text-right">
                            <p>Email: support@unikari.com</p>
                            <p>Website: https://unikari.com</p>
                            <p>Contact No: +91-9509287876</p>
                        </div>
                    </div>

                    {/* Order Information Section */}
                    <div className="bg-white p-6 my-6 rounded-md grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">ORDER ID</p>
                            <p className="text-lg font-semibold">{id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">INVOICE NO</p>
                            <p className="text-lg font-semibold">{ "INV-01"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">DATE</p>
                            <p className="text-lg font-semibold">{formatDate(order ? order.createdAt : new Date())}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">PAYMENT STATUS</p>
                            <p className="text-lg font-semibold text-green-600">{order ? (order?.paymentMethod ) : ""}</p>
                        </div>
                        {/* <div>
                            <p className="text-sm text-gray-600">ORDER STATUS</p>
                            <p className="text-lg font-semibold text-blue-600">{order ? order.status : ""}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">TOTAL AMOUNT</p>
                            <p className="text-lg font-semibold">₹ {order ? order.amountAfterShipping : 0}</p>
                        </div> */}
                    </div>

                    {/* Address Section */}
                    <div className="bg-white p-6 rounded-md my-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-lg font-semibold mb-2">Shipping Address</p>
                            <p>{order ? order?.shippingAddress.name : ""}</p>
                            <p>{order ? order?.shippingAddress.email : ""}</p>
                            <p>{order ? order?.shippingAddress.phone : ""}</p>
                            <p>{order ? order?.shippingAddress.address : ""}, {order ? order?.shippingAddress.pincode : ""}</p>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="bg-white p-6 rounded-md my-6 overflow-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="border-b p-2">#</th>
                                    <th className="border-b p-2">Product Details</th>
                                    <th className="border-b p-2">Rate</th>
                                    <th className="border-b p-2">Quantity</th>
                                    <th className="border-b p-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order && order.items && order.items.length > 0 ? JSON.parse(order.items).map((item, index) => (
                                    <tr key={index}>
                                        <td className="border-b p-2">{index + 1}</td>
                                        <td className="border-b p-2">{item.productName}</td>
                                        <td className="border-b p-2">₹{item.priceAfterDiscount.toFixed(2)}</td>
                                        <td className="border-b p-2">{item.quantity}</td>
                                        <td className="border-b p-2">₹{+(item.priceAfterDiscount * item?.quantity).toFixed(2) }</td>
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-white p-6 rounded-md my-6 text-right">
                        <div className="flex justify-between">
                            <p>Sub Total</p>
                            <p>₹ {order ? order.subTotal.toFixed(2) : 0}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Discount</p>
                            <p>₹ -{order ? order.discount : 0}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Shipping Charge</p>
                            <p>₹ {order ? order.shippingCharges : 0}</p>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                            <p>Total Amount</p>
                            <p>₹ {order ? order.finalAmount.toFixed(2) : 0}</p>
                        </div>
                    </div>
                {/* Print Button */}
                {/* <button onClick={()=>window.print()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" >
                    Print Order Summary
                </button> */}
                </div>

            </div>
       
    );
}





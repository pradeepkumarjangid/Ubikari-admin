import axios from "axios"

const baseUrl = `http://localhost:4007/api`
// const baseUrl = `https://api.unikari.com/api`
// const shiprocket = `https://apiv2.shiprocket.in/v1`
// 


const loginShipRocket = async()=>{
    let data = {
        "email": "info.kabbumart@gmail.com",
        "password": "Kabbu@2024"
    }
    try{
       let result = await axios.post(`${shiprocket}/external/auth/login` , data)
       return result.data.token
       console.log(result)
    }catch(err){
        console.log(err)
    }
}
const apiObj = {
    login  : (data)=>{
        return axios.post(`${baseUrl}/admin/login` , data)
    },
    getCategory : (headers)=>{
        return axios.get(`${baseUrl}/admin/category/getAllCategory` , {headers})
    },
    getCategoryWithSubCat : (headers)=>{
        return axios.get(`${baseUrl}/admin/category/getCatWithSubCat` , {headers})
    },
    createCategory : (data , headers)=>{
        return axios.post(`${baseUrl}/category/create` , data , {headers})
    },
    editCategory : (id , data , headers)=>{
        return axios.put(`${baseUrl}/category/update/${id}` , data , {headers})
    },
    searchCategory : (query , headers)=>{
        return axios.get(`${baseUrl}/category/search?q=${query}`  , {headers})
    },
    deleteCategory : (id , headers)=>{
        return axios.delete(`${baseUrl}/category/delete/${id}` , {headers})
    },
    getSubCategory : (headers)=>{
        return axios.get(`${baseUrl}/subCategory/admin/allSubCategories` , {headers})
    },
    getSubCategoryOfACategory : (id )=>{
        return axios.get(`${baseUrl}/subCategory/get-by-category/${id}`)
    },
    createSubCategory : (data , headers)=>{
        return axios.post(`${baseUrl}/subCategory/create` , data , {headers})
    },
    editSubCategory : (id , data , headers)=>{
        return axios.put(`${baseUrl}/subCategory/edit/${id}` , data , {headers})
    },
    deleteSubCategory : (id , headers)=>{
        return axios.delete(`${baseUrl}/subCategory/delete/${id}`  , {headers})
    },
    searchSubCategory : (query , headers)=>{
        return axios.get(`${baseUrl}/subCategory/search?q=${query}`  , {headers})
    },
    // products
    getProducts : (headers)=>{
        return axios.get(`${baseUrl}/product/admin/all` , {headers})
    },
    getSingleProduct : (id , headers)=>{
        console.log(id)
        return axios.get(`${baseUrl}/product/singleProduct?q=${id}` , {headers})
    },
    createProduct : (data , headers)=>{
        return axios.post(`${baseUrl}/product/create` , data , {headers})
    },
    uploadProductExcel : (data , headers)=>{
        return axios.post(`${baseUrl}/product/upload-excel` , data , {headers})
    },
    editProduct : (id , data , headers)=>{
        return axios.put(`${baseUrl}/product/edit/${id}` , data , {headers})
    },
    editReview : (id , data , headers)=>{
        return axios.put(`${baseUrl}/review/admin/edit/${id}` , data , {headers})
    },
    deleteReview : (id  , headers)=>{
        return axios.delete(`${baseUrl}/review/admin/delete/${id}`  , {headers})
    },
    deleteProduct : (id , headers)=>{
        return axios.delete(`${baseUrl}/product/delete/${id}`  , {headers})
    },
    searchProduct : (query , headers)=>{
        return axios.get(`${baseUrl}/product/get/search?q=${query}`  , {headers})
    },
    // customers
    getCustomers : (headers)=>{
        return axios.get(`${baseUrl}/admin/customers` , {headers})
    },
    // getSingleProduct : (id , headers)=>{
    //     console.log(id)
    //     return axios.get(`${baseUrl}/product/${id}` , {headers})
    // },
    // createProduct : (data , headers)=>{
    //     return axios.post(`${baseUrl}/product/create` , data , {headers})
    // },
    editCustomer : (id , data , headers)=>{
        return axios.put(`${baseUrl}/admin/editCustomer/${id}` , data , {headers})
    },
    deleteCustomer : (id , headers)=>{
        return axios.delete(`${baseUrl}/admin/deleteCustomer/${id}`  , {headers})
    },
    searchCustomer : (query , headers)=>{
        return axios.get(`${baseUrl}/admin/searchCustomer?q=${query}`  , {headers})
    },
    // order
    getOrders : (headers)=>{
        return axios.get(`${baseUrl}/order/allOrders` , {headers})
    },
    createOrderOnShip : (data , headers)=>{
        return axios.post(`${baseUrl}/order/create-order-on-ship` ,data, {headers})
    },
    // deleteOrder : (id , headers)=>{
    //     return axios.delete(`${baseUrl}/order/delete/${id}`  , {headers})
    // },
    searchOrder : (query , headers)=>{
        return axios.get(`${baseUrl}/order/searchOrder?q=${query}`  , {headers})
    },
    getSingleOrder : (id , headers)=>{
        return axios.get(`${baseUrl}/order/getSingleOrder/${id}` , {headers})
    },
    deleteOrder : (id , headers)=>{
        return axios.delete(`${baseUrl}/order/deleteOrder/${id}`  , {headers})
    },
    editOrder : (id , data , headers)=>{
        return axios.put(`${baseUrl}/order/admin/editOrder/${id}` , data , {headers})
    },
    // discount
    addDiscount : (data , headers)=>{
        return axios.post(`${baseUrl}/discount/apply-discount` , data , {headers})
    },
    // offer
    getOffers : (headers)=>{
        return axios.get(`${baseUrl}/coupon` , {headers})
    },
    createOffer : (data , headers)=>{
        return axios.post(`${baseUrl}/coupon/create` , data , {headers})
    },
    searchOffer : (query , headers)=>{
        return axios.post(`${baseUrl}/coupon/searchCoupen?q=${query}`   , {headers})
    },
    getSingleOffer : (id , headers)=>{
        return axios.get(`${baseUrl}/coupon/getOneCoupen/${id}` , {headers})
    },
    deleteOffer : (id , headers)=>{
        return axios.delete(`${baseUrl}/coupon//deleteCoupen/${id}`  , {headers})
    },
    editOffer : (id , data , headers)=>{
        return axios.put(`${baseUrl}/coupon/updateCoupen/${id}` , data , {headers})
    },
    // dashboard
    // getDashboardData : (headers)=>{
    //     return axios.get(`${baseUrl}/order/periods/orders` , {headers})
    // },
    getDashboardData : (headers)=>{
        return axios.get(`${baseUrl}/shiprocket/periods/orders` , {headers})
    },
    getDashboardGraph : (headers)=>{
        return axios.get(`${baseUrl}/order/deliveredOrderGraph` , {headers})
    },


    // Shiprockets return Apis
    getAllReturnOrder: async (from , to ,page , limit , status, headers) => {
        return axios.post(`${baseUrl}/shiprocket/all/return/order?page=${page}&limit=${limit}&filterBy=${status}&from=${from}&to=${to}` , {headers})
    },
    cancelReturnOrder: async (data, headers) => {
        return axios.post(`${baseUrl}/shiprocket/cancel/return/order` , data , {headers})
    },
    generateAWBReturnOrder: async (data, headers) => {
        return axios.post(`${baseUrl}/shiprocket/generateAWB/return/order` , data , {headers})
    },
    // Shiprockets Apis
    getAllShiprocketOrders: async (from , to ,page , limit , status, headers) => {
        return axios.get(`${baseUrl}/shiprocket/allorders?page=${page}&limit=${limit}&filterBy=${status}&from=${from}&to=${to}` , {headers})
    },
    getSingleShipmentOrder : (id , headers)=>{
        return axios.get(`${baseUrl}/shiprocket/single/${id}` , {headers})
    },
    editShipmentOrder : (data , headers)=>{
        console.log(headers)
        return axios.post(`${baseUrl}/shiprocket/edit/order` ,data , {headers})
    },
    downloadInvoice : (data , headers)=>{
        return axios.post(`${baseUrl}/shiprocket/invoice/download` , data , {headers})
    },
    downloadLabel : (data , headers)=>{
        return axios.post(`${baseUrl}/shiprocket/generate/label` , data , {headers})
    },
    cancelShipment : async( data ,  headers )=>{
        return await axios.post(`${baseUrl}/shiprocket/cancel/shipment` , data , {headers})
    },
    cancelOrder : async( data ,  headers )=>{
        return await axios.post(`${baseUrl}/shiprocket/cancel/order` , data , {headers})
    },
    createShipment : async( data ,  headers )=>{
        return await axios.post(`${baseUrl}/shiprocket/generate/awb` , data , {headers})
    },
    // razorpay
    getRazorpayPayment : async(   headers )=>{
        return await axios.get(`${baseUrl}/payment/razorpay/orders` ,  {headers})
    },
    getRazorpayRefundPayment : async(   headers )=>{
        return await axios.get(`${baseUrl}/payment/razorpay/refunds` ,  {headers})
    },
    getSingleRazorpayPayment : async( id ,  headers )=>{
        return await axios.get(`${baseUrl}/payment/razorpay/payments/${id}` ,  {headers})
    },
    getPaymentData : async( headers)=>{
        return await axios.get(`${baseUrl}/payment/razorpay/collectedAmount` , {headers} )
    },
    

}

export default apiObj
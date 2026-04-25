const API_BASE_URL = "http://localhost:8080/api/order"

import axios  from "axios";



export const getAllOrders = async ( ) => {



    try {


        const response = await  axios.get(`${API_BASE_URL}`);

        console.log("Orders retrieved successfully:", response.data);


        return response.data;

    }catch( error) {
        console.error("Error retrieving orders:", error);
        throw error;
    }
}



export const getOrdersByUserId = async  (userId) => {


    try {

        const response = await axios.get(`${API_BASE_URL}/user?userId=${userId}`);

        console.log("Orders retrieved successfully:", response.data);
        return response.data;
    }catch

    (error) {
        console.error("Error retrieving orders:", error);
        throw error;
    }
}

export const acceptOrder = async (orderId ,     deliverId ) => {


    try {


        const response =  await axios.get(`${API_BASE_URL}/accept-order/${orderId}/${deliverId}`);

        console.log("Order accepted successfully:", response.data);

        return response.data
    }catch (error) {
        console.error("Error accepting order:", error);
        throw error;
    }



}


export const placeOrder = async (orderData) => {
    try {
        // Ensure the payload matches the backend OrderDto structure
        const payload = {
            customerName: orderData.customerName,
            customerId: orderData.customerId,
            shippingAddress: orderData.shippingAddress,
            billingAddress: orderData.billingAddress,
            ids: orderData.productIds, // productIds should be an array of strings
        };
        const response = await axios.post(`${API_BASE_URL}`, payload);
        console.log(payload);
        console.log("Order placed successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
}
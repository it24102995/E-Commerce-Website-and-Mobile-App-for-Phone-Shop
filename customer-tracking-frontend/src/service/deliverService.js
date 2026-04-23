const API_BASE_URL = "http://localhost:8080/api/deliver"

const API_BASE_URL_ORDER = "http://localhost:8080/api/order"



import  axios from "axios";




export const loginDeliver = async (deliverData) => {


    try {


        const response = await axios.post(`${API_BASE_URL}/login`, deliverData);
        localStorage.setItem("deliver", JSON.stringify(response.data));


        console.log("Deliver logged in successfully:", response.data);
        return response.data ;
    }catch( error) {

        console.error("Error logging in deliver:", error);
        throw error; 
    }


}


export const acceptOrder = async (orderId) => {
    // Get deliverId from localStorage
    const deliver = JSON.parse(localStorage.getItem("deliver"));
    const deliverId = deliver.deliverId;
    if (!orderId || !deliverId) {
        throw new Error("Missing orderId or deliverId");
    }
    try {
        const response = await axios.post(`${API_BASE_URL_ORDER}/accept-order/${orderId}/${deliverId}`);
        console.log("Order accepted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error accepting order:", error);
        throw error;
    }
}




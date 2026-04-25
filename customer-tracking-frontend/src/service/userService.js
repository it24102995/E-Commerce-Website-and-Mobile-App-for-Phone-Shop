import axios from "axios";

const BASE_API_URL = "http://localhost:8080/api";

//  this function is for  registering  the user

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/user/register`, userData);
         localStorage.setItem("user", JSON.stringify(response.data));
        console.log("User registered successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

// this function is for logging in the user
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/user/login`, userData);
        console.log("User logged in successfully:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

// Get redirect path based on user role
export const getRedirectPath = (role) => {
    if (role === "DELIVER") {
        return "/deliver-dashboard";
    }
    return "/home";
};
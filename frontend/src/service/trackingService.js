const API_BASE_URL = '/api';

export const trackingService = {
    async riderSignup(riderData) {
        const response = await fetch(`${API_BASE_URL}/riders/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(riderData),
        });
        return response.json();
    },

    async riderLogin(email, password) {
        const response = await fetch(`${API_BASE_URL}/riders/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    async getAvailableOrders() {
        const response = await fetch(`${API_BASE_URL}/tracking/orders/available`);
        return response.json();
    },

    async getRiderOrders(riderId) {
        const response = await fetch(`${API_BASE_URL}/tracking/orders/rider/${riderId}`);
        return response.json();
    },

    async acceptOrder(orderId, riderId) {
        const response = await fetch(`${API_BASE_URL}/tracking/orders/${orderId}/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ riderId }),
        });
        return response.ok;
    },

    async updateLocation(riderId, orderId, latitude, longitude) {
        const response = await fetch(`${API_BASE_URL}/tracking/location/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ riderId, orderId, latitude, longitude }),
        });
        return response.ok;
    },

    async getRiderLocation(riderId) {
        const response = await fetch(`${API_BASE_URL}/tracking/location/rider/${riderId}`);
        return response.json();
    },

    async getOrderLocation(orderId) {
        const response = await fetch(`${API_BASE_URL}/tracking/location/order/${orderId}`);
        if (!response.ok) return null;
        return response.json();
    }
};

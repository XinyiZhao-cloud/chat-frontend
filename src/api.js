import axios from "axios";

const api = axios.create({
    baseURL: "https://live-chat-api-hzcdd4evhwfpbue9.westus3-01.azurewebsites.net"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
import axios from "axios";

export class Config{
    static axiosInstance() {
        return axios.create({
            baseURL: import.meta.env.VITE_API_SERVICE_URL,
            withCredentials: true
        });
    } 

}


import axios from "axios";

const instance = axios.create({
  baseURL: "http://173.230.135.194:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptors for custom logic
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    console.log("Request sent:", config);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default instance;

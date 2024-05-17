import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
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
    alert("alertign from axios Something Went wrong");
    if (error.response && error.response.status == 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    if (error.response && error.response.status == 401) {
      window.location.href = "/login";
    }
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default instance;

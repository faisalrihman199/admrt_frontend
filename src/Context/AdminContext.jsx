import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"; // Move import to the top

// Create a context for API and WebSocket functionality
const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const authHeader = useAuthHeader(); // Hook to get the auth header

    const config = {
        headers: {
            Authorization: authHeader,
        }
    };

    const server =process.env.REACT_APP_API_BASE_URL;

    // Fetch accounts dashboard data
    const chartDashboardData = async (type,period) => {
    try {
        const response = await axios.get(`${server}/settings/admin/${type}/?period=${period}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        throw error; // Optional: rethrow or handle the error as needed
    }}   
    const addAffiliateLink = async (data) => {
    try {
        const response = await axios.post(`${server}/settings/addAffliate/`, data,config);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        throw error; // Optional: rethrow or handle the error as needed
    }
    };
    const visitorDashboard=async (period) => {
        try {
            const response = await axios.get(`${server}/settings/visitor/?period=${period}`, config);
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
            throw error; // Optional: rethrow or handle the error as needed
        }}   
    const deleteAffiliateLink = async (id) => {
    try {
        const response = await axios.delete(`${server}/settings/affliate/delete/${id}/`,config);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        throw error; // Optional: rethrow or handle the error as needed
    }
    };
    const tableDashboardData = async (type,page,name) => {
        try {
            let url=`${server}/settings/${type}/?page=${page}`
            if(name){
                url+=`&name=${name}`
            }
            const response = await axios.get(url, config);
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
            throw error; // Optional: rethrow or handle the error as needed
    }}  
    const deleteUser=async (id) => {
        try {
            const response = await axios.delete(`${server}/settings/deleteUser/?id=${id}`, config);
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
            throw error; // Optional: rethrow or handle the error as needed
        }} 
    const navData=async () => {
        try {
            const response = await axios.get(`${server}/settings/navStats/`, config);
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
            throw error; // Optional: rethrow or handle the error as needed
    }}  

    return (
        <AdminContext.Provider value={{ 
            chartDashboardData,
            addAffiliateLink,
            tableDashboardData,
            deleteAffiliateLink,
            visitorDashboard,
            deleteUser,
            navData,
            
            
            }}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook to use the AdminContext
const useAdmin = () => useContext(AdminContext);

export { AdminProvider, useAdmin };

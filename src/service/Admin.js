import apiClient from "../util/apiClient";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";


export async function AccountDashboard({ period }) {
    const authHeader = useAuthHeader()

    try {
      console.log("im Getting Accounts for Admin ");
  
      const response = await apiClient.get(`/settings/admin/accounts?period=${period}`, {
        headers: {
          Authorization: authHeader,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
import apiClient from "../util/apiClient";

async function serverLogin(email, password) {
  try {
    const response = await apiClient.post("/auth/jwt/create", {
      username: email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default serverLogin;

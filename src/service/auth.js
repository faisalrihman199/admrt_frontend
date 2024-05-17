import apiClient from "../util/apiClient";

async function userLoginApi(email, password) {
  try {
    const response = await apiClient.post("/auth/jwt/create", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function userRegisterApi(user) {
  try {
    const response = await apiClient.post("/auth/users/", user);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { userLoginApi, userRegisterApi };
